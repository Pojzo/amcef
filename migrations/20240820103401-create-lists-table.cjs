"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("lists", {
			listId: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			title: {
				type: Sequelize.STRING(50),
				allowNull: false,
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
		}),
			await queryInterface.createTable("userLists", {
				listId: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					allowNull: false,
					references: {
						model: "lists",
						key: "listId",
					},
					onUpdate: "CASCADE",
					onDelete: "CASCADE",
				},
				userId: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					allowNull: false,
					references: {
						model: "users",
						key: "userId",
					},
					onUpdate: "CASCADE",
					onDelete: "CASCADE",
				},
			});
	},

	async down(queryInterface, Sequelize) {
		queryInterface.dropTable("userLists");
		queryInterface.dropTable("lists");
	},
};
