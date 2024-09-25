import * as Sequelize from "sequelize";
import { UsersStatusEnum } from "../enums";
import { ModelTimestampExtend } from "./timestampInterface";

export interface InputUserInterface {
  name: string;
  email: string;
  password: string;
  workspaceName?: string;
  //   status: UsersStatusEnum;
  //   verificationCode: number;
}

export interface UserInterface extends InputUserInterface, ModelTimestampExtend {
  id: number;
  status: UsersStatusEnum;
  verificationCode: number;
}

export interface UserModelInterface
  extends Sequelize.Model<UserInterface, Partial<InputUserInterface>>,
    UserInterface {}
