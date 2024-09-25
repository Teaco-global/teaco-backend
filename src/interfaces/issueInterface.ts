import * as Sequelize from "sequelize";
import { ModelTimestampExtend } from "./timestampInterface";

export interface InputIssueInterface {
  workspaceId: number;
  projectId: number;
  type: string;
}

export interface IssueInterface extends InputIssueInterface, ModelTimestampExtend {
    id: number;
}

export interface IssueModelInterface
  extends Sequelize.Model<IssueInterface, Partial<InputIssueInterface>>,
    IssueInterface {}
