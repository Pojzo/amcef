'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('items', [
      {
        itemId: 1,
        listId: 1,
        title: 'Buy Milk',
        description: 'Get 2 liters of milk',
        createdBy: 1,
        flag: 'active',
        deadline: new Date(),
      },
      {
        itemId: 2,
        listId: 2,
        title: 'Finish Report',
        description: 'Complete the financial report',
        createdBy: 2,
        flag: 'active',
        deadline: new Date(),
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('items', null, {});
  }
};