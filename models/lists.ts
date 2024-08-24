import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { items, itemsId } from "./items";
import type { userLists, userListsId } from "./userLists";
import type { users, usersId } from "./users";

export interface listsAttributes {
	listId: number;
	title: string;
	createdBy: number;
}

export type listsPk = "listId";
export type listsId = lists[listsPk];
export type listsOptionalAttributes = "listId";
export type listsCreationAttributes = Optional<
	listsAttributes,
	listsOptionalAttributes
>;

export class lists
	extends Model<listsAttributes, listsCreationAttributes>
	implements listsAttributes
{
	listId!: number;
	title!: string;
	createdBy!: number;

	// lists hasMany items via listId
	items!: items[];
	getItems!: Sequelize.HasManyGetAssociationsMixin<items>;
	setItems!: Sequelize.HasManySetAssociationsMixin<items, itemsId>;
	addItem!: Sequelize.HasManyAddAssociationMixin<items, itemsId>;
	addItems!: Sequelize.HasManyAddAssociationsMixin<items, itemsId>;
	createItem!: Sequelize.HasManyCreateAssociationMixin<items>;
	removeItem!: Sequelize.HasManyRemoveAssociationMixin<items, itemsId>;
	removeItems!: Sequelize.HasManyRemoveAssociationsMixin<items, itemsId>;
	hasItem!: Sequelize.HasManyHasAssociationMixin<items, itemsId>;
	hasItems!: Sequelize.HasManyHasAssociationsMixin<items, itemsId>;
	countItems!: Sequelize.HasManyCountAssociationsMixin;
	// lists hasMany userLists via listId
	userLists!: userLists[];
	getUserLists!: Sequelize.HasManyGetAssociationsMixin<userLists>;
	setUserLists!: Sequelize.HasManySetAssociationsMixin<
		userLists,
		userListsId
	>;
	addUserList!: Sequelize.HasManyAddAssociationMixin<userLists, userListsId>;
	addUserLists!: Sequelize.HasManyAddAssociationsMixin<
		userLists,
		userListsId
	>;
	createUserList!: Sequelize.HasManyCreateAssociationMixin<userLists>;
	removeUserList!: Sequelize.HasManyRemoveAssociationMixin<
		userLists,
		userListsId
	>;
	removeUserLists!: Sequelize.HasManyRemoveAssociationsMixin<
		userLists,
		userListsId
	>;
	hasUserList!: Sequelize.HasManyHasAssociationMixin<userLists, userListsId>;
	hasUserLists!: Sequelize.HasManyHasAssociationsMixin<
		userLists,
		userListsId
	>;
	countUserLists!: Sequelize.HasManyCountAssociationsMixin;
	// lists belongsToMany users via listId and userId
	userId_users!: users[];
	getUserId_users!: Sequelize.BelongsToManyGetAssociationsMixin<users>;
	setUserId_users!: Sequelize.BelongsToManySetAssociationsMixin<
		users,
		usersId
	>;
	addUserId_user!: Sequelize.BelongsToManyAddAssociationMixin<users, usersId>;
	addUserId_users!: Sequelize.BelongsToManyAddAssociationsMixin<
		users,
		usersId
	>;
	createUserId_user!: Sequelize.BelongsToManyCreateAssociationMixin<users>;
	removeUserId_user!: Sequelize.BelongsToManyRemoveAssociationMixin<
		users,
		usersId
	>;
	removeUserId_users!: Sequelize.BelongsToManyRemoveAssociationsMixin<
		users,
		usersId
	>;
	hasUserId_user!: Sequelize.BelongsToManyHasAssociationMixin<users, usersId>;
	hasUserId_users!: Sequelize.BelongsToManyHasAssociationsMixin<
		users,
		usersId
	>;
	countUserId_users!: Sequelize.BelongsToManyCountAssociationsMixin;
	// lists belongsTo users via createdBy
	createdBy_user!: users;
	getCreatedBy_user!: Sequelize.BelongsToGetAssociationMixin<users>;
	setCreatedBy_user!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
	createCreatedBy_user!: Sequelize.BelongsToCreateAssociationMixin<users>;

	static initModel(sequelize: Sequelize.Sequelize): typeof lists {
		return lists.init(
			{
				listId: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				title: {
					type: DataTypes.STRING(50),
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
			},
			{
				sequelize,
				tableName: "lists",
				timestamps: false,
				indexes: [
					{
						name: "PRIMARY",
						unique: true,
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
