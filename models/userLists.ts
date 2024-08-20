import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { lists, listsId } from './lists';
import type { users, usersId } from './users';

export interface userListsAttributes {
  listId: number;
  userid: number;
}

export type userListsPk = "listId" | "userid";
export type userListsId = userLists[userListsPk];
export type userListsCreationAttributes = userListsAttributes;

export class userLists extends Model<userListsAttributes, userListsCreationAttributes> implements userListsAttributes {
  listId!: number;
  userid!: number;

  // userLists belongsTo lists via listId
  list!: lists;
  getList!: Sequelize.BelongsToGetAssociationMixin<lists>;
  setList!: Sequelize.BelongsToSetAssociationMixin<lists, listsId>;
  createList!: Sequelize.BelongsToCreateAssociationMixin<lists>;
  // userLists belongsTo users via userid
  user!: users;
  getUser!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof userLists {
    return userLists.init({
    listId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'lists',
        key: 'listId'
      }
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'userId'
      }
    }
  }, {
    sequelize,
    tableName: 'userLists',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "listId" },
          { name: "userid" },
        ]
      },
      {
        name: "userid",
        using: "BTREE",
        fields: [
          { name: "userid" },
        ]
      },
    ]
  });
  }
}
