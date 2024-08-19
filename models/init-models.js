import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _SequelizeMeta from  "./SequelizeMeta.js";
import _users from  "./users.js";

export default function initModels(sequelize) {
  const SequelizeMeta = _SequelizeMeta.init(sequelize, DataTypes);
  const users = _users.init(sequelize, DataTypes);


  return {
    SequelizeMeta,
    users,
  };
}
