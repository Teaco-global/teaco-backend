import * as Sequelize from "sequelize";

import { Database } from "../config";

const sequelize = Database.sequelize;

const RoomUserWorkspaces =
  sequelize.define(
    "chat_room_user_workspaces",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      roomId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: "room_id",
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
          model: "chat_rooms",
          key: "id",
        },
      },
      userWorkspaceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: "user_workspace_id",
        references: {
          model: "chat_rooms",
          key: "id",
        },
      },
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
      tableName: "chat_room_user_workspaces",
      freezeTableName: true,
    }
  );

export default RoomUserWorkspaces;