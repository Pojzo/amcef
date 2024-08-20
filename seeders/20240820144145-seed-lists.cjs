'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('lists', [
      {
        listId: 1,
        title: 'Groceries',
        createdBy: 1,
      },
      {
        listId: 2,
        title: 'Work Tasks',
        createdBy: 2,
      }
    ], {});

    await queryInterface.bulkInsert('userLists', [
      {
        listId: 1,
        userId: 1,
      },
      {
        listId: 2,
        userId: 2,
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('userLists', null, {});
    await queryInterface.bulkDelete('lists', null, {});
  }
};