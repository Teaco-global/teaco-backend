import { WhereOptions } from "sequelize";
import bcrypt from "bcrypt";
import crypto from "crypto";

import { InputUserInterface, UserInterface } from "../interfaces";
import { saltRound } from "../config";
import { UserRepository } from "../repositories/userRepository";
import { WorkspaceRepository } from "../repositories";
import { transporter } from "../helpers";
import { WorkspaceService } from "./workspaceService";

export class UsersService {
  private repository;
  constructor() {
    this.repository = new UserRepository;
  }

  public async findByPk(id: number) {
    return this.repository.findByPk(id)
  }

  public async createUserAndWorkspace(input: InputUserInterface): Promise<UserInterface> {
    const verificationCode = crypto.randomInt(10000, 99999);

    const user = await this.repository.create({
        name: input.name,
        email: input.email,
        password: await bcrypt.hash(input.password, saltRound),
        verificationCode: verificationCode,
      });
  
      await new WorkspaceService().create({
        ownerId: user.id,
        label: input.workspaceName,
      })

      try {
        await transporter.sendMail({
          to: input.email,
          subject: "Verification code",
          html: `Your verification code is <b>${verificationCode}<b>`,
        });
      } catch (err: any) {
        console.error(err.message);
      }
    
    return await this.repository.findByPk(user.id)
  }

  public async create({
    name,
    email,
    password,
    verificationCode,
  }: {
    name?: string;
    email?: string;
    password?: string;
    verificationCode?: number;
  }): Promise<UserInterface> {
    const emailExists = await this.repository.findOne({
      where: {
        email: email,
      },
    });
    if (emailExists) {
      throw new Error(`Email ${email} already exists.`);
    }

    return this.repository.create({
      name,
      email,
      password,
      verificationCode,
    });
  }

  public async findOne({ email }: { email: string }): Promise<UserInterface> {
    let where: WhereOptions<any> = {};

    if (email) where = { ...where, email: email };

    return this.repository.findOne({
      where: where,
    });
  }

  public async updateOne({
    id,
    input,
  }: {
    id: number;
    input: Partial<UserInterface>;
  }): Promise<UserInterface> {
    let where: WhereOptions<any> = {};

    await this.repository.updateOne({id, input});
    return this.repository.findByPk(id)
  }
}
