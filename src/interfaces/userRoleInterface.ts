import * as Sequelize from 'sequelize';

import { ModelTimestampExtend } from './timestampInterface';

export interface InputUserRoleInterface {
  userId?: Sequelize.CreationOptional<number>;
  roleId: Sequelize.CreationOptional<number>;
}

export interface UserRoleInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  userId: Sequelize.CreationOptional<number>;
  roleId: Sequelize.CreationOptional<number>;
  level:number
}
