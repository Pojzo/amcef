/**
 * @file Database configuration file
 * @author Peter Kovac
 * @date 19.8.2024
 *
 * @description Initialize the sequelize module. initModels() function takes care of loading the predefined models in ./src/models.
 * Returns the database connection - 'sequelize' and the models - the model names are changed to 'javaScriptStyle' instead of 'python_style'.
 */

import { Sequelize } from "sequelize";
import { DATABASE_NAME, HOST, PASSWORD, USER } from "./configs/dbConfig.js";

// Initialize Sequelize instance
const sequelize = new Sequelize(DATABASE_NAME, USER, PASSWORD, {
    host: HOST,
    dialect: "mysql", // 'mysql' or other dialect
    logging: false,
});

console.log(`Using database: ${DATABASE_NAME}`);

// import models generated with sequelize-auto
// npx sequelize-auto -o './src/models' -l esm -d taskapp -h localhost -u root -x Ivanakoper -e mysql
import initModels from "../models/init-models.js";

// initialize models
let models = initModels(sequelize);

// exports
export { sequelize, models };

export default sequelize;