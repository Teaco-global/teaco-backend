'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('wikis', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(25),
        allowNull: true
      },
      identity: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      content: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      workspace_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'workspaces',
          key: 'id',
        },
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
    await queryInterface.addIndex('wikis', ['identity'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'wikis_identity',
      where: {
        deleted_at: null,
      },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('wikis');
  }
};
