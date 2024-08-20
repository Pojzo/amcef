import type { Sequelize } from "sequelize";
import { SequelizeMeta as _SequelizeMeta } from "./SequelizeMeta";
import type { SequelizeMetaAttributes, SequelizeMetaCreationAttributes } from "./SequelizeMeta";
import { items as _items } from "./items";
import type { itemsAttributes, itemsCreationAttributes } from "./items";
import { lists as _lists } from "./lists";
import type { listsAttributes, listsCreationAttributes } from "./lists";
import { userLists as _userLists } from "./userLists";
import type { userListsAttributes, userListsCreationAttributes } from "./userLists";
import { users as _users } from "./users";
import type { usersAttributes, usersCreationAttributes } from "./users";

export {
  _SequelizeMeta as SequelizeMeta,
  _items as items,
  _lists as lists,
  _userLists as userLists,
  _users as users,
};

export type {
  SequelizeMetaAttributes,
  SequelizeMetaCreationAttributes,
  itemsAttributes,
  itemsCreationAttributes,
  listsAttributes,
  listsCreationAttributes,
  userListsAttributes,
  userListsCreationAttributes,
  usersAttributes,
  usersCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const SequelizeMeta = _SequelizeMeta.initModel(sequelize);
  const items = _items.initModel(sequelize);
  const lists = _lists.initModel(sequelize);
  const userLists = _userLists.initModel(sequelize);
  const users = _users.initModel(sequelize);

  lists.belongsToMany(users, { as: 'userId_users', through: userLists, foreignKey: "listId", otherKey: "userId" });
  users.belongsToMany(lists, { as: 'listId_lists', through: userLists, foreignKey: "userId", otherKey: "listId" });
  items.belongsTo(lists, { as: "list", foreignKey: "listId" });
  lists.hasMany(items, { as: "items", foreignKey: "listId" });
  userLists.belongsTo(lists, { as: "list", foreignKey: "listId" });
  lists.hasMany(userLists, { as: "userLists", foreignKey: "listId" });
  items.belongsTo(users, { as: "createdBy_user", foreignKey: "createdBy" });
  users.hasMany(items, { as: "items", foreignKey: "createdBy" });
  lists.belongsTo(users, { as: "createdBy_user", foreignKey: "createdBy" });
  users.hasMany(lists, { as: "lists", foreignKey: "createdBy" });
  userLists.belongsTo(users, { as: "user", foreignKey: "userId" });
  users.hasMany(userLists, { as: "userLists", foreignKey: "userId" });

  return {
    SequelizeMeta: SequelizeMeta,
    items: items,
    lists: lists,
    userLists: userLists,
    users: users,
  };
}
