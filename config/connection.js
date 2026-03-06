require("dotenv").config();

const Sequelize = require("sequelize");

const connectionUrl = process.env.DATABASE_URL || process.env.JAWSDB_URL;
const inferredDialect = connectionUrl
  ? new URL(connectionUrl).protocol.replace(":", "")
  : null;

if (!connectionUrl && process.env.DB_PASSWORD === "ChangeMe!") {
  console.error("Please update the .env file with your database password.");
  process.exit(1);
}

const sequelize = connectionUrl
  ? new Sequelize(connectionUrl, {
      dialect: process.env.DB_DIALECT || inferredDialect || "mysql",
      logging: false,
      dialectOptions:
        process.env.DB_SSL === "true"
          ? {
              ssl: {
                require: true,
                rejectUnauthorized: false,
              },
            }
          : {},
    })
  : new Sequelize(
      process.env.DB_DATABASE || process.env.DB_NAME,
      process.env.DB_USERNAME || process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST || "localhost",
        dialect: process.env.DB_DIALECT || "mysql",
        port: Number(process.env.DB_PORT || 3306),
        logging: false,
      }
    );

module.exports = sequelize;
