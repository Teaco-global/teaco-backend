import * as Sequelize from 'sequelize';
import { RoleEnum } from '../enums';
import { ModelTimestampExtend } from '../interfaces';
import { RoleInterface } from '../interfaces';

export interface InputUserWorkspaceRoleInterface {
  userWorkspaceId?: Sequelize.CreationOptional<number>;
  roleId: Sequelize.CreationOptional<number>;
  role?: RoleEnum;
}

export interface UserWorkspaceRoleInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  userWorkspaceId: Sequelize.CreationOptional<number>;
  roleId: Sequelize.CreationOptional<number>;
  role: RoleInterface;
}
