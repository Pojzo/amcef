'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('items', [
      {
        itemId: 1,
        listId: 1, // Reference to the 'Groceries' list
        title: 'Buy Milk',
        description: 'Get 2 liters of milk',
        createdBy: 1, // Reference to the first user (user1@example.com)
        flag: 'active',
        deadline: new Date(),
      },
      {
        itemId: 2,
        listId: 2, // Reference to the 'Work Tasks' list
        title: 'Finish Report',
        description: 'Complete the financial report',
        createdBy: 2, // Reference to the second user (user2@example.com)
        flag: 'active',
        deadline: new Date(),
      },
      {
        itemId: 3,
        listId: 1, // Another item for the 'Groceries' list
        title: 'Buy Bread',
        description: 'Get a loaf of bread',
        createdBy: 1, // Reference to the first user (user1@example.com)
        flag: 'active',
        deadline: new Date(),
      },
      {
        itemId: 4,
        listId: 2, // Another item for the 'Work Tasks' list
        title: 'Send Emails',
        description: 'Reply to important emails',
        createdBy: 2, // Reference to the second user (user2@example.com)
        flag: 'finished',
        deadline: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('items', null, {});
  }
};