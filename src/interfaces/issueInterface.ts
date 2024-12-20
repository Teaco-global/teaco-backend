import * as Sequelize from "sequelize";
import { ModelTimestampExtend } from ".";
import { IssuePriorityEnum, IssueStatusEnum, IssueTypeEnum } from "../enums";

export interface InputIssueInterface {
  workspaceId: number;
  projectId: number;
  type?: IssueTypeEnum;
  title: string;
  issueCount?: number;
  description?: string;
  parentId?: number;
  status?: IssueStatusEnum;
  priority: IssuePriorityEnum;
  estimatedPoints: number;
  sprintId?: number;
  columnId?: number;
  createdById: number;
  assignedToId?: number;
  assignedById?: number;
}

export interface IssueInterface
  extends InputIssueInterface,
    ModelTimestampExtend {
  id: number;
}

export interface IssueModelInterface
  extends Sequelize.Model<IssueInterface, Partial<InputIssueInterface>>,
    IssueInterface {}
