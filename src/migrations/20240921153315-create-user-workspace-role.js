/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_workspace_roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_workspace_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'user_workspaces',
          key: 'id',
        },
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id',
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

    await queryInterface.addIndex('user_workspace_roles', ['user_workspace_id', 'role_id'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'user_workspace_id_role_id',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('user_workspace_roles', 'user_workspace_id_role_id');
    await queryInterface.dropTable('user_workspace_roles');
  },
};
