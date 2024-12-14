'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('chat_messages', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      room_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "chat_rooms",
          key: "id",
        },
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      workspace_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'workspaces',
          key: 'id',
        },
      },
      sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user_workspaces",
          key: "id",
        },
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: DataTypes.DATE,
      },
    });
    await queryInterface.addIndex('chat_messages', ['workspace_id', 'sender_id'], {
      concurrently: true,
      name: 'chat_messages_workspace_id_sender_id',
      fields: ['workspaceId', 'sender_id'],
      where: {
        deleted_at: null,
      },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('chat_messages', 'chat_messages_workspace_id_sender_id');
    await queryInterface.dropTable('chat_messages');
  }
};