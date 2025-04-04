import * as Sequelize from "sequelize";

import { Database } from "../config";
import { RoomTypeEnum } from "../enums";
import RoomUserWorkspaces from "./roomUserWorkspace";

const sequelize = Database.sequelize;

const Room = sequelize.define(
  "chat_rooms",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    label: {
      type: Sequelize.STRING(25),
      allowNull: true,
    },
    identity: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    type: {
      type: Sequelize.ENUM(
        RoomTypeEnum.couple,
        RoomTypeEnum.group,
        RoomTypeEnum.channels
      ),
      allowNull: false,
    },
    isPublic: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    workspaceId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: "workspace_id",
      references: {
        model: "workspaces",
        key: "id",
      },
    },
    createdById: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: "created_by_id",
      references: {
        model: "user_workspaces",
        key: "id",
      },
    },
    updatedById: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: "updated_by_id",
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
    tableName: "chat_rooms",
    freezeTableName: true,
    indexes: [
      {
        unique: false,
        concurrently: true,
        name: "chat_rooms_identity",
        fields: ["identity"],
        where: {
          deleted_at: null,
        },
      },
    ],
  }
);

Room.hasMany(RoomUserWorkspaces, {
  foreignKey: "roomId",
  as: "roomUserWorkspaces",
});

RoomUserWorkspaces.belongsTo(Room, {
  foreignKey: "roomId",
  as: "room",
});

export default Room;
