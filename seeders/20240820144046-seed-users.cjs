'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        userId: 1,
        email: 'user1@example.com',
        password: 'hashedpassword1',
        jwtTokenVersion: 0,
      },
      {
        userId: 2,
        email: 'user2@example.com',
        password: 'hashedpassword2',
        jwtTokenVersion: 0,
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};