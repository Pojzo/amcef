"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			"items",
			[
				{
					itemId: 1,
					listId: 1,
					title: "Buy Milk",
					description: "Get 2 liters of milk",
					flag: "active",
					deadline: new Date(),
					createdBy: 1,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					itemId: 2,
					listId: 2,
					title: "Finish Report",
					description: "Complete the financial report",
					createdBy: 2,
					flag: "active",
					deadline: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					itemId: 3,
					listId: 1,
					title: "Buy Bread",
					description: "Get a loaf of bread",
					createdBy: 1,
					flag: "active",
					deadline: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					itemId: 4,
					listId: 2,
					title: "Send Emails",
					description: "Reply to important emails",
					createdBy: 2,
					flag: "finished",
					deadline: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{}
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("items", null, {});
	},
};
