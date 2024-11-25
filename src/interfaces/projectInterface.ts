import * as Sequelize from "sequelize";
import { ProjectStatusEnum } from "../enums";
import { ModelTimestampExtend } from "./timestampInterface";

export interface InputProjectInterface {
  workspaceId: number;
  name: string;
  description?: string;
  createdById?: number;
  startDate?: Date;
  completedDate?: Date;
  status?: ProjectStatusEnum;
}

export interface ProjectInterface
  extends InputProjectInterface,
    ModelTimestampExtend {
  id: number;
  status: ProjectStatusEnum;
}
export interface ProjectModelInterface
  extends Sequelize.Model<ProjectInterface, Partial<InputProjectInterface>>,
    ProjectInterface {}
