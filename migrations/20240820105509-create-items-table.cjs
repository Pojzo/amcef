"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("items", {
			itemId: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
				notNull: true,
			},
			listId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "lists",
					key: "listId",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			title: {
				type: Sequelize.STRING(50),
				allowNull: false,
			},
			description: {
				type: Sequelize.STRING(255),
				allowNull: false,
			},
			createdAt: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.NOW,
			},
			updatedAt: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.NOW,
			},
			createdBy: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "users",
					key: "userId",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			flag: {
				type: Sequelize.ENUM("active", "finished", "aborted"),
				defaultValue: "active",
				allowNull: false,
			},
			deadline: {
				type: Sequelize.DATE,
				allowNull: true,
			},
		});
	},

	async down(queryInterface, Sequelize) {
		queryInterface.dropTable("items");
	},
};
