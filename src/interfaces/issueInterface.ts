import * as Sequelize from "sequelize";
import { ModelTimestampExtend } from "./timestampInterface";
import { IssueStatusEnum, IssueTypeEnum } from "../enums";

export interface InputIssueInterface {
  workspaceId: number;
  projectId: number;
  type?: IssueTypeEnum;
  title: string;
  description?: string;
  parentId?: number;
  status?: IssueStatusEnum;
  sprintId?: number;
  columnId?: number;
  createdById: number 
}

export interface IssueInterface extends InputIssueInterface, ModelTimestampExtend {
    id: number;
}

export interface IssueModelInterface
  extends Sequelize.Model<IssueInterface, Partial<InputIssueInterface>>,
    IssueInterface {}
