import * as Sequelize from 'sequelize';
import { RoleEnum, UserWorkspaceStatusEnum } from '../enums';

import { InputUserWorkspaceRoleInterface, ModelTimestampExtend, UserInterface, UserWorkspaceRoleInterface, WorkspaceInterface } from '.';

export interface InputUserWorkspaceInterface {
  userId?: Sequelize.CreationOptional<number>;
  workspaceId?: Sequelize.CreationOptional<number>;
  userWorkspaceRoles?: InputUserWorkspaceRoleInterface[];
  role?: RoleEnum;
  status?: UserWorkspaceStatusEnum;
  identity: string;
  lastLoginAt?: Date;
}

export interface UserWorkspaceInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  userId: Sequelize.CreationOptional<number>;
  workspaceId: Sequelize.CreationOptional<number>;
  status: UserWorkspaceStatusEnum;
  user?: UserInterface;
  identity: string;
  userWorkspaceRoles?: UserWorkspaceRoleInterface[];
  workspace?: WorkspaceInterface;
  lastLoginAt?: Date;
}

export interface UserWorkspaceExtend {
  userWorkspaceId: Sequelize.CreationOptional<number>;
}

export interface UserWorkspaceModelInterface
  extends Sequelize.Model<UserWorkspaceInterface, Partial<InputUserWorkspaceInterface>>,
  UserWorkspaceInterface {}
