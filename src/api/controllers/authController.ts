import crypto from "crypto";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

import { InputUserInterface, UserInterface } from "../../interfaces";
import { UsersService, UserWorkspaceService } from "../../services";
import { Authenticate, Validator } from "../../middlewares";
import {
  login,
  resendVerificationCode,
  signUp,
  verifyAccount,
} from "../../validators";
import { transporter } from "../../helpers";
import { UsersStatusEnum } from "../../enums";
import { WorkspaceService } from "../../services/workspaceService";

export class AuthController {
  public constructor() {}

  static async signUp(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password, workspaceName } =
        req.body as InputUserInterface;
      Validator.check(signUp, { name, email, password });

      const userExists = await new UsersService().findOne({ email: email });
      if (userExists) {
        return res.status(409).json({
          error: {
            message: "User already exists.",
            code: "CONFLICT",
          },
        });
      }
      await new UsersService().createUserAndWorkspace({
        name,
        email,
        password,
        workspaceName,
      });

      return res.status(200).json({
        message: "User and workspace created successfully.",
      });
    } catch (error) {
      console.error("Error signing up.");
      return res.status(500).json({
        message: "An error occurred while trying to sign up.",
        error: error.message || "Unexpected error.",
      });
    }
  }

  static async verifyAccount(req: Request, res: Response): Promise<Response> {
    try {
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
    } catch(error) { 
      console.error("Error verifying.");
      return res.status(500).json({
        message: "An error occurred while verfying email.",
        error: error.message || "Unexpected error.",
      });
    }
  }

  static async resendVerificationCode(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { email } = req.body;
    Validator.check(resendVerificationCode, { email });
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
    try {
      const { email, password } = req.body;
      Validator.check(login, { email });
      const userExists = await new UsersService().findOne({ email: email });

      if (!userExists) throw new Error(`User with email ${email} does not exists`);
      console.log({userExists})
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
    } catch (error) {
      console.error("Error logging in.");
      console.log(error)
      return res.status(500).json({
        message: "An error occurred while trying to log in.",
        error: error.message || "Unexpected error.",
      });
    }
  }
  static async authMe(req: Request, res: Response): Promise<Response> {
    const user = (
      await Authenticate.verifyAccessToken(req.headers.authorization)
    ).data as UserInterface;
    const userWorkspace = await new UserWorkspaceService().findOne({
      userId: user.id,
    });
    const workspace = await new WorkspaceService().findByPk(
      userWorkspace.workspaceId
    );
    return res.status(200).json({
      data: {
        userWorkspace,
        user,
        workspace,
      },
    });
  }
}
