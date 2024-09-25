'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stories', {
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
      assigned_to_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'user_workspaces',
          key: 'id'
        }
      },
      created_by_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'user_workspaces',
          key: 'id'
        }
      },
      issue_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'issues',
          key: 'id'
        }
      },
      sprint_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'sprints',
          key: 'id'
        }
      },
      board_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'boards',
          key: 'id'
        }
      },
      story_point: {
        type: DataTypes.INTEGER
      },
      description: {
        type: DataTypes.TEXT,
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
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('stories');
  }
};
