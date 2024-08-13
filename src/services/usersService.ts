import { WhereOptions, where } from "sequelize";
import { UserInterface } from "../interfaces";
import User from "../models/users";

export class UsersService {
  private model;
  constructor() {
    this.model = User;
  }

  public async create({
    name,
    email,
    password,
    verificationCode,
  }: {
    name: string;
    email: string;
    password: string;
    verificationCode: number;
  }): Promise<UserInterface> {
    const emailExists = await this.model.findOne({
      where: {
        email: email,
      },
    });
    if (emailExists) {
      throw new Error(`Email ${email} already exists.`);
    }

    return this.model.create({
      name,
      email,
      password,
      verificationCode,
    });
  }

  public async findOne({ email }: { email: string }): Promise<UserInterface> {
    let where: WhereOptions<any> = {};

    if (email) where = { ...where, email: email };

    return this.model.findOne({
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
    return this.model.update(input, { where: {id: id}});
  }
}
