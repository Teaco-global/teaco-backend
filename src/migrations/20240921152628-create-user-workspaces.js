/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_workspaces', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      workspace_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'workspaces',
          key: 'id',
        },
      },
      status: {
        type: DataTypes.ENUM('pending', 'accepted'),
        allowNull: false,
        defaultValue: 'pending',
      },
      identity: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_login_at: {
        type: DataTypes.DATE,
        allowNull: true,
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
    await queryInterface.addIndex('user_workspaces', ['identity'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'user_workspaces_identity',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('user_workspaces', 'user_workspaces_identity');
    await queryInterface.dropTable('user_workspaces');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_user_workspaces_status";');
  },
};
