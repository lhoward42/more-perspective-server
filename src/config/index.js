require("dotenv").config();

const config = {
  appPort: parseInt(process.env.PORT),
  dbName: process.env.DB_NAME,
  jwtSecret: process.env.JWT_KEY,
  dbURL: `postgres://${process.env.DB_USR}:${process.env.DB_PWD}@${
    process.env.DB_HOST
  }:${parseInt(process.env.DB_PORT)}/${process.env.DB_NAME}`,
  environment: process.env.ENVIRONMENT,
};

module.exports = config;