import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { items, itemsId } from "./items";
import type { lists, listsId } from "./lists";
import type { userLists, userListsId } from "./userLists";

export interface usersAttributes {
	userId: number;
	email: string;
	password: string;
	jwtTokenVersion: number;
}

export type usersPk = "userId";
export type usersId = users[usersPk];
export type usersOptionalAttributes = "userId" | "jwtTokenVersion";
export type usersCreationAttributes = Optional<
	usersAttributes,
	usersOptionalAttributes
>;

export class users
	extends Model<usersAttributes, usersCreationAttributes>
	implements usersAttributes
{
	userId!: number;
	email!: string;
	password!: string;
	jwtTokenVersion!: number;

	// users hasMany items via createdBy
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
	// users hasMany lists via createdBy
	lists!: lists[];
	getLists!: Sequelize.HasManyGetAssociationsMixin<lists>;
	setLists!: Sequelize.HasManySetAssociationsMixin<lists, listsId>;
	addList!: Sequelize.HasManyAddAssociationMixin<lists, listsId>;
	addLists!: Sequelize.HasManyAddAssociationsMixin<lists, listsId>;
	createList!: Sequelize.HasManyCreateAssociationMixin<lists>;
	removeList!: Sequelize.HasManyRemoveAssociationMixin<lists, listsId>;
	removeLists!: Sequelize.HasManyRemoveAssociationsMixin<lists, listsId>;
	hasList!: Sequelize.HasManyHasAssociationMixin<lists, listsId>;
	hasLists!: Sequelize.HasManyHasAssociationsMixin<lists, listsId>;
	countLists!: Sequelize.HasManyCountAssociationsMixin;
	// users belongsToMany lists via userId and listId
	listId_lists!: lists[];
	getListId_lists!: Sequelize.BelongsToManyGetAssociationsMixin<lists>;
	setListId_lists!: Sequelize.BelongsToManySetAssociationsMixin<
		lists,
		listsId
	>;
	addListId_list!: Sequelize.BelongsToManyAddAssociationMixin<lists, listsId>;
	addListId_lists!: Sequelize.BelongsToManyAddAssociationsMixin<
		lists,
		listsId
	>;
	createListId_list!: Sequelize.BelongsToManyCreateAssociationMixin<lists>;
	removeListId_list!: Sequelize.BelongsToManyRemoveAssociationMixin<
		lists,
		listsId
	>;
	removeListId_lists!: Sequelize.BelongsToManyRemoveAssociationsMixin<
		lists,
		listsId
	>;
	hasListId_list!: Sequelize.BelongsToManyHasAssociationMixin<lists, listsId>;
	hasListId_lists!: Sequelize.BelongsToManyHasAssociationsMixin<
		lists,
		listsId
	>;
	countListId_lists!: Sequelize.BelongsToManyCountAssociationsMixin;
	// users hasMany userLists via userId
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

	static initModel(sequelize: Sequelize.Sequelize): typeof users {
		return users.init(
			{
				userId: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				email: {
					type: DataTypes.STRING(100),
					allowNull: false,
					unique: "email",
				},
				password: {
					type: DataTypes.STRING(100),
					allowNull: false,
				},
				jwtTokenVersion: {
					type: DataTypes.INTEGER,
					allowNull: false,
					defaultValue: 0,
				},
			},
			{
				sequelize,
				tableName: "users",
				hasTrigger: true,
				timestamps: false,
				indexes: [
					{
						name: "PRIMARY",
						unique: true,
						using: "BTREE",
						fields: [{ name: "userId" }],
					},
					{
						name: "email",
						unique: true,
						using: "BTREE",
						fields: [{ name: "email" }],
					},
				],
			}
		);
	}
}
