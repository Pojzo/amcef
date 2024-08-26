/**
 * @file Database configuration
 * @author Peter Kovac
 * @date 19.8.2024
 */

const envDbMap = {
	dev: "database_development",
	test: "database_test",
	prod: "database_production",
};
console.log(process.env.DB_ENV);

const USER: string = "root";
const PASSWORD: string = "Root12345";
const DB_ENV: string = process.env.DB_ENV || "dev";
const DATABASE_NAME: string = envDbMap[DB_ENV] || "database_development";
const HOST: string = "127.0.0.1";

export { USER, PASSWORD, DATABASE_NAME, HOST };
