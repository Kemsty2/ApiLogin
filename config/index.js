import "dotenv/config";

module.exports = {
	port: process.env.NODE_PORT,
	env: process.env.NODE_ENV,
	database: process.env.DATABASE,
	databaseDialect: process.env.DATABASE_DIALECT,
	databaseUsername: process.env.DATABASE_USER,
	databasePassword: process.env.DATABASE_PASSWORD,
	databasePort: process.env.DATABASE_PORT,
	databaseHost: process.env.DATABASE_HOST
}