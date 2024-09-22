'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Customer role level range 0-9
     * Administrator role level range 10-19
     * Support role level range 20-29
     */
    await queryInterface.bulkInsert(
      'roles',
      [
        {
          id: 1,
          label: 'Owner',
          slug: 'owner',
          level: 0,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          label: 'Member',
          slug: 'member',
          level: 0,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
