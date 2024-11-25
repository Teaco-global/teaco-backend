'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'columns',
      [
        {
          id: 1,
          label: 'TO DO',
          slug: 'to-do',
          position: 0,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          label: 'IN PROGRESS',
          slug: 'in-progress',
          position: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 3,
          label: 'IN REVIEW',
          slug: 'in-review',
          position: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 4,
          label: 'DONE',
          slug: 'done',
          position: 3,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('columns', null, {});
  }
};
