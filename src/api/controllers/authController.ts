import crypto from "crypto";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

import { InputUserInterface, UserInterface } from "../../interfaces";
import { UsersService } from "../../services";
import { saltRound } from "../../config";
import { Authenticate, Validator } from "../../middlewares";
import { login, resendVerificationCode, signUp, verifyAccount } from "../../validators";
import { transporter } from "../../helpers";
import { UsersStatusEnum } from "../../enums";

export class AuthController {
  public constructor() {}

  static async signUp(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body as InputUserInterface;
    Validator.check(signUp, { name, email, password });
    const userExists = await new UsersService().findOne({email: email})
    if (userExists) {
      return res.status(409).json({
        error: {
          message: "User already exists.",
          code: "CONFLICT"
        }
      });
    }
    const verificationCode = crypto.randomInt(10000, 99999);

    await new UsersService().create({
      name: name,
      email: email,
      password: await bcrypt.hash(password, saltRound),
      verificationCode: verificationCode,
    });

    try {
      await transporter.sendMail({
        to: email,
        subject: "Verification code",
        html: `Your verification code is <b>${verificationCode}<b>`,
      });
    } catch (err: any) {
      console.error(err.message);
    }

    return res.status(200).json({
      message: "User has been registered successfully.",
    });
  }

  static async verifyAccount(req: Request, res: Response): Promise<Response> {
    const { email, verificationCode } = req.body;
    Validator.check(verifyAccount, { email, verificationCode });
    const emailExists = await new UsersService().findOne({ email: email });

    if (!emailExists) throw new Error(`Email ${email} does not exists.`);

    if (emailExists.status === UsersStatusEnum.VERFIED)
      throw new Error(`Email ${email} is already verified.`);

    if (emailExists.verificationCode != verificationCode)
      throw new Error(`Invalid verification code.`);

    await new UsersService().updateOne({
      id: emailExists.id,
      input: { status: UsersStatusEnum.VERFIED, verificationCode: null },
    });

    return res.status(200).json({
      message: "Account verified successfully.",
    });
  }

  static async resendVerificationCode(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { email } = req.body;
    Validator.check(resendVerificationCode, { email })
    const emailExists = await new UsersService().findOne({ email: email });

    if (!emailExists) throw new Error(`Email ${email} does not exists.`);

    if (emailExists.status === UsersStatusEnum.VERFIED)
      throw new Error(`Email ${email} is already verified.`);

    const verificationCode = crypto.randomInt(10000, 99999);

    await new UsersService().updateOne({
      id: emailExists.id,
      input: { verificationCode: verificationCode },
    });

    try {
      await transporter.sendMail({
        to: email,
        subject: "Verification code",
        html: `Your verification code is <b>${verificationCode}<b>`,
      });
    } catch (err: any) {
      console.error(err.message);
    }

    return res.status(200).json({
      message: "Verification code has been resent to your email.",
    });
  }

  static async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    Validator.check(login, { email, password })
    const userExists = await new UsersService().findOne({ email: email });

    if (!userExists) throw new Error(`User does not exists`);
    if (userExists.status != UsersStatusEnum.VERFIED)
      throw new Error(
        "You are not verified, please verify your account and log in."
      );

    const matchPassword = await bcrypt.compare(password, userExists.password);
    if (!matchPassword) throw new Error("Invalid password.");

    const accessToken = await Authenticate.generateAcessToken(userExists);
    return res.status(200).json({
      message: "Login successfull.",
      token: {
        access: accessToken,
      },
    });
  }
  static async home(req: Request, res: Response): Promise<Response> {
    const user = (await Authenticate.verifyAccessToken(req.headers.authorization)).data as UserInterface;
    return res.status(200).json({
        message: `Hello,  ${user.name}`,
    })
  }
}
