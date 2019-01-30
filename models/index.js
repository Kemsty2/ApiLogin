import fs from "fs";
import path from "path";
import Sequelize from "sequelize";
import {database, databaseDialect, databaseHost, databasePassword, databasePort, databaseUsername,} from "../config"

const config = {
	dialect: databaseDialect,
	host: databaseHost,
	port: databasePort
}
console.log({database, databaseDialect, databasePassword, databaseUsername});

const sequelize = new Sequelize(database,databaseUsername, databasePassword, config)
let db = {};

fs.readdirSync(__dirname).filter(file => {
	return (file.indexOf(".") !== 0) && (file !== "index.js");
}).forEach(file => {
	const model = sequelize.import(path.join(__dirname, file));
	db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
	if ("association" in db[modelName]){
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;