import * as Sequelize from "sequelize";
import { SprintStatusEnum } from "../enums";
import { ModelTimestampExtend } from "./timestampInterface";
import { IssueInterface } from "./issueInterface";

export interface InputSprintInterface {
  workspaceId: number;
  projectId: number;
  goal?: string;
  status?: SprintStatusEnum;
  sprintCount: number;
  startDate?: Date;
  dueDate?: Date;
  completedDate?: Date;
}

export interface SprintInterface extends InputSprintInterface, ModelTimestampExtend {
  id: number;
  issues?: IssueInterface[];
  issuesCount?: number;
  daysLeft?: number;
}

export interface SprintModelInterface
  extends Sequelize.Model<SprintInterface, Partial<InputSprintInterface>>,
    SprintInterface {}
