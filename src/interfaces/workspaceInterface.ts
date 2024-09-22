import * as Sequelize from "sequelize";
import { ModelTimestampExtend } from "./timestampInterface";
import { InputUserWorkspaceInterface } from "./userWorkspaceInterface";

export interface InputWorkspaceInterface {
  label?: string;
  secret?: string;
  ownerId?: number;
  workspaceUsers?: InputUserWorkspaceInterface[];
}
export interface WorkspaceInterface extends ModelTimestampExtend {
  id: number;
  label: string;
  secret: string;
  ownerId: number;
  workspaceUsers?: InputUserWorkspaceInterface[];
}

export interface WorkspaceModelInterface
  extends Sequelize.Model<WorkspaceInterface, Partial<InputWorkspaceInterface>>,
    WorkspaceInterface {}

export interface WorkspaceExtend {
  workspaceId: Sequelize.CreationOptional<number>;
}
