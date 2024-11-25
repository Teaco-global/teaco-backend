'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('issue_user_workspaces', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      workspace_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'workspaces',
          key: 'id'
        }
      },
      issue_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'issues',
          key: 'id',
        },
      },
      assigned_to_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'user_workspaces',
          key: 'id',
        },
      },
      assigned_by_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'user_workspaces',
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

    await queryInterface.addIndex('issue_user_workspaces', ['workspace_id', 'issue_id', 'assigned_to_id'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'issue_user_workspace_workspace_id_issue_id_assigned_to_id',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('issue_user_workspaces', 'issue_user_workspace_workspace_id_issue_id_user_workspace_id');
    await queryInterface.dropTable('issue_user_workspaces');
  },
};
