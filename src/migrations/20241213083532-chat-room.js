'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('chat_rooms', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      label: {
        type: DataTypes.STRING(25),
        allowNull: true
      },
      identity: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('couple', 'group', 'channels'),
        allowNull: false,
      },
      is_public: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_by_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "user_workspaces",
          key: "id",
        },
      },
      updated_by_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
    await queryInterface.addIndex('chat_rooms', ['identity'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'chat_rooms_identity',
      where: {
        deleted_at: null,
      },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('chat_rooms', 'chat_rooms_identity');
    await queryInterface.dropTable('chat_rooms');
  },
};
