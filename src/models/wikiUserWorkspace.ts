import * as Sequelize from "sequelize";

import { Database } from "../config";

const sequelize = Database.sequelize;

const WikiUserWorkspace = sequelize.define(
  "wiki_user_workspaces",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    wikiId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: "wiki_id",
      references: {
        model: "chat_rooms",
        key: "id",
      },
    },
    workspaceId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: "workspace_id",
      references: {
        model: "workspaces",
        key: "id",
      },
    },
    userWorkspaceId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: "user_workspace_id",
      references: {
        model: "user_workspaces",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    tableName: "wiki_user_workspaces",
    freezeTableName: true,
  }
);

export default WikiUserWorkspace;
