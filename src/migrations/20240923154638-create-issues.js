'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('issues', {
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
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'projects',
          key: 'id'
        }
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      description: {
        type: DataTypes.STRING(1000),
        allowNull: true
      },
      parent_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'issues',
          key: 'id'
        }
      },
      issue_count: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('IN_BACKLOG', 'PENDING', 'COMPLETED'),
        defaultValue: 'IN_BACKLOG'
      },
      sprint_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'sprints',
          key: 'id'
        }
      },
      column_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'columns',
          key: 'id'
        }
      },
      type: {
        type: DataTypes.ENUM(
          'FEATURE',
          'BUG',
          'ENHANCEMENT',
          'REFACTOR',
          'DOCUMENTATION',
          'TASK',
          'CHORE',
          'QUESTION',
          'SUPPORT',
          'SECURITY',
          'PERFORMANCE',
          'UX',
          'DEPLOYMENT',
          'TESTING',
          'CI_CD',
          'UNCATEGORIZED'
        ),
        allowNull: false,
        defaultValue: 'UNCATEGORIZED',
      },
      created_by_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'user_workspaces',
          key: 'id',
        },
      },
      assigned_to_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'user_workspaces',
          key: 'id',
        },
      },
      assigned_by_id: {
        type: DataTypes.INTEGER,
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
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('issues');
  }
};
