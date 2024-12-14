import * as Sequelize from 'sequelize';

import { Database } from '../config';
import UserWorkspace from './userWorkspace';

const sequelize = Database.sequelize;

const Message = sequelize.define(
  'messages',
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
      references: {
      model: "chat_rooms",
        key: "id"
      },
      field: 'room_id'
    },
    body: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    workspaceId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'workspaces',
        key: 'id',
      },
      field: 'workspace_id'
    },
    senderId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "user_workspaces",
        key: "id"
      },
      field: 'sender_id'
    }
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    tableName: 'chat_messages',
    indexes: [
      {
        fields: ['workspace_id', 'sender_id'],
        where: {
          deleted_at: null,
        },
      },
    ],
  },
);

export default Message;

Message.belongsTo(UserWorkspace, {
  foreignKey: "senderId",
  as: "sender"
});
