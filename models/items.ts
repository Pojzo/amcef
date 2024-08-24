import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { lists, listsId } from "./lists";
import type { users, usersId } from "./users";

export interface itemsAttributes {
	itemId: number;
	listId: number;
	title: string;
	description: string;
	createdBy: number;
	flag: "active" | "finished" | "aborted";
	deadline?: Date;
}

export type itemsPk = "itemId";
export type itemsId = items[itemsPk];
export type itemsOptionalAttributes = "itemId" | "flag" | "deadline";
export type itemsCreationAttributes = Optional<
	itemsAttributes,
	itemsOptionalAttributes
>;

export class items
	extends Model<itemsAttributes, itemsCreationAttributes>
	implements itemsAttributes
{
	itemId!: number;
	listId!: number;
	title!: string;
	description!: string;
	createdBy!: number;
	flag!: "active" | "finished" | "aborted";
	deadline?: Date;

	// items belongsTo lists via listId
	list!: lists;
	getList!: Sequelize.BelongsToGetAssociationMixin<lists>;
	setList!: Sequelize.BelongsToSetAssociationMixin<lists, listsId>;
	createList!: Sequelize.BelongsToCreateAssociationMixin<lists>;
	// items belongsTo users via createdBy
	createdBy_user!: users;
	getCreatedBy_user!: Sequelize.BelongsToGetAssociationMixin<users>;
	setCreatedBy_user!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
	createCreatedBy_user!: Sequelize.BelongsToCreateAssociationMixin<users>;

	static initModel(sequelize: Sequelize.Sequelize): typeof items {
		return items.init(
			{
				itemId: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				listId: {
					type: DataTypes.INTEGER,
					allowNull: false,
					references: {
						model: "lists",
						key: "listId",
					},
					onDelete: "CASCADE",
					onUpdate: "CASCADE",
				},
				title: {
					type: DataTypes.STRING(50),
					allowNull: false,
				},
				description: {
					type: DataTypes.STRING(255),
					allowNull: false,
				},
				createdBy: {
					type: DataTypes.INTEGER,
					allowNull: false,
					references: {
						model: "users",
						key: "userId",
					},
					onDelete: "CASCADE",
					onUpdate: "CASCADE",
				},
				flag: {
					type: DataTypes.ENUM("active", "finished", "aborted"),
					allowNull: false,
					defaultValue: "active",
				},
				deadline: {
					type: DataTypes.DATE,
					allowNull: true,
				},
			},
			{
				sequelize,
				tableName: "items",
				timestamps: false,
				indexes: [
					{
						name: "PRIMARY",
						unique: true,
						using: "BTREE",
						fields: [{ name: "itemId" }],
					},
					{
						name: "listId",
						using: "BTREE",
						fields: [{ name: "listId" }],
					},
					{
						name: "createdBy",
						using: "BTREE",
						fields: [{ name: "createdBy" }],
					},
				],
			}
		);
	}
}
