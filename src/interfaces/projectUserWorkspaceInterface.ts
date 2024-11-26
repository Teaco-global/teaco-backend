import * as Sequelize from "sequelize";
import { ModelTimestampExtend } from "./timestampInterface";

export interface InputProjectUserWorkspaceInterface {
  workspaceId: number;
  assignedToId: number;
  assignedById: number;
  projectId: number;
  assignedAt: Date;
}

export interface ProjectUserWorkspaceInterface
  extends InputProjectUserWorkspaceInterface, ModelTimestampExtend {
    id: number;
  }

export interface ProjectUserWorkspaceModelInterface
  extends Sequelize.Model<
      ProjectUserWorkspaceInterface,
      Partial<InputProjectUserWorkspaceInterface>
    >,
    ProjectUserWorkspaceInterface {}
