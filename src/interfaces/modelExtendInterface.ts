import * as Sequelize from "sequelize";

import { UserWorkspaceInterface } from "./userWorkspaceInterface";
export interface ModelTimestampExtend {
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface ModelCreatorIdExtend {
  createdById?: Sequelize.CreationOptional<number>;
  updatedById?: Sequelize.CreationOptional<number>;
}

export interface ModelCreatorIncludeExtend extends ModelCreatorIdExtend {
  createdBy: UserWorkspaceInterface;
  updatedBy: UserWorkspaceInterface;
}
