import * as Sequelize from "sequelize";

import { UserWorkspaceModelInterface } from "../interfaces/userWorkspaceInterface";
import { Database } from "../config";
import { UserWorkspaceStatusEnum } from "../enums";
import UserWorkspaceRole from "./userWorkspaceRole";
import ProjectUserWorkspace from "./projectUserWorkspace";
import Project from "./projects";
const sequelize = Database.sequelize;

const UserWorkspace = sequelize.define<UserWorkspaceModelInterface>(
  "user_workspaces",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      field: "user_id",
    },
    workspaceId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "workspaces",
        key: "id",
      },
      field: "workspace_id",
    },
    status: {
      type: Sequelize.ENUM(
        UserWorkspaceStatusEnum.PENDING,
        UserWorkspaceStatusEnum.ACCEPTED
      ),
      allowNull: false,
      defaultValue: UserWorkspaceStatusEnum.PENDING,
    },
    identity: {
      type: Sequelize.STRING(31),
      allowNull: false,
    },
    lastLoginAt: {
      type: Sequelize.DATE,
      allowNull: true,
      field: "last_login_at",
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["userId"],
        where: {
          deleted_at: null,
        },
      },
      {
        unique: true,
        fields: ["workspaceId"],
        where: {
          deleted_at: null,
        },
      },
    ],
  }
);

UserWorkspace.hasMany(UserWorkspaceRole, {
  foreignKey: "userWorkspaceId",
  as: "userWorkspaceRoles",
});

UserWorkspaceRole.belongsTo(UserWorkspace, {
  foreignKey: "userWorkspaceId",
  as: "userWorkspace",
});

export default UserWorkspace;
