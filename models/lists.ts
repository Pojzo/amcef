import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { items, itemsId } from './items';
import type { userLists, userListsId } from './userLists';
import type { users, usersId } from './users';

export interface listsAttributes {
  listId: number;
  title: string;
}

export type listsPk = "listId";
export type listsId = lists[listsPk];
export type listsOptionalAttributes = "listId";
export type listsCreationAttributes = Optional<listsAttributes, listsOptionalAttributes>;

export class lists extends Model<listsAttributes, listsCreationAttributes> implements listsAttributes {
  listId!: number;
  title!: string;

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
  setUserLists!: Sequelize.HasManySetAssociationsMixin<userLists, userListsId>;
  addUserList!: Sequelize.HasManyAddAssociationMixin<userLists, userListsId>;
  addUserLists!: Sequelize.HasManyAddAssociationsMixin<userLists, userListsId>;
  createUserList!: Sequelize.HasManyCreateAssociationMixin<userLists>;
  removeUserList!: Sequelize.HasManyRemoveAssociationMixin<userLists, userListsId>;
  removeUserLists!: Sequelize.HasManyRemoveAssociationsMixin<userLists, userListsId>;
  hasUserList!: Sequelize.HasManyHasAssociationMixin<userLists, userListsId>;
  hasUserLists!: Sequelize.HasManyHasAssociationsMixin<userLists, userListsId>;
  countUserLists!: Sequelize.HasManyCountAssociationsMixin;
  // lists belongsToMany users via listId and userid
  userid_users!: users[];
  getUserid_users!: Sequelize.BelongsToManyGetAssociationsMixin<users>;
  setUserid_users!: Sequelize.BelongsToManySetAssociationsMixin<users, usersId>;
  addUserid_user!: Sequelize.BelongsToManyAddAssociationMixin<users, usersId>;
  addUserid_users!: Sequelize.BelongsToManyAddAssociationsMixin<users, usersId>;
  createUserid_user!: Sequelize.BelongsToManyCreateAssociationMixin<users>;
  removeUserid_user!: Sequelize.BelongsToManyRemoveAssociationMixin<users, usersId>;
  removeUserid_users!: Sequelize.BelongsToManyRemoveAssociationsMixin<users, usersId>;
  hasUserid_user!: Sequelize.BelongsToManyHasAssociationMixin<users, usersId>;
  hasUserid_users!: Sequelize.BelongsToManyHasAssociationsMixin<users, usersId>;
  countUserid_users!: Sequelize.BelongsToManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof lists {
    return lists.init({
    listId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'lists',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "listId" },
        ]
      },
    ]
  });
  }
}
