import * as Sequelize from 'sequelize';

import { ModelTimestampExtend, WorkspaceExtend } from '../interfaces';

export interface InputRoleInterface
extends WorkspaceExtend {
  label: string;
  slug: string;
  level: number;

}

export interface RoleInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  label: string;
  slug: string;
  level: number;
}

export interface RoleModelInterface
  extends Sequelize.Model<RoleInterface, Partial<InputRoleInterface>>,
  RoleInterface {}