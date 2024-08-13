'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('VERIFIED', 'UNVERIFIED'),
        allowNull: false,
        defaultValue: 'UNVERIFIED'
      },
      verification_code: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          len: [5, 5]
        }
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
    await queryInterface.addIndex('users', ['email'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'users_email',
      where: {
        deleted_at: null,
      },
    });
    await queryInterface.addIndex('users', ['verification_code'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'users_verification_code',
      where: {
        deleted_at: null,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('users', 'users_email');
    await queryInterface.removeIndex('users', 'users_verification_code');
    await queryInterface.dropTable('users');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_status";');
  }
};
