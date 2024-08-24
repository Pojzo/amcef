/**
 * @file Database configuration file
 * @author Peter Kovac
 * @date 19.8.2024
 *
 * @description Initialize the sequelize module. initModels() function takes care of loading the predefined models in ../models.
 */

import { Sequelize } from "sequelize-typescript";
import { DATABASE_NAME, HOST, PASSWORD, USER } from "./configs/dbConfig.js";

// Initialize Sequelize instance
const sequelize = new Sequelize(DATABASE_NAME, USER, PASSWORD, {
	host: HOST,
	dialect: "mysql",
	logging: false,
});

console.log(`Using database: ${DATABASE_NAME}`);

// Import models generated with sequelize-auto
import { initModels } from "../models/init-models";

// initialize models
let models = initModels(sequelize);

// exports
export { sequelize, models };

export default sequelize;
