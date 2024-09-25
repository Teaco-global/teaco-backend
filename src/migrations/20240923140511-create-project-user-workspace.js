'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('project_user_workspaces', {
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
      assigned_to_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'user_workspaces',
          key: 'id'
        }
      },
      assigned_by_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'user_workspaces',
          key: 'id'
        }
      },
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'projects',
          key: 'id'
        }
      },
      assigned_at: {
        type: DataTypes.DATE,
        allowNull: false
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
    }),
      await queryInterface.addIndex('project_user_workspaces', ['workspace_id', 'project_id', 'assigned_to_id'], {
        concurrently: true,
        unique: true,
        type: 'UNIQUE',
        name: 'project_user_workspace_workspace_id_project_id_assigned_to_id',
        where: {
          deleted_at: null,
        },
      });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('project_user_workspaces', 'project_user_workspace_workspace_id_project_id_assigned_to_id');
    await queryInterface.dropTable('project_user_workspaces');
  }
};
