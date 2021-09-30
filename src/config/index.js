require("dotenv").config();

const config = {
  appPort: parseInt(process.env.PORT),
  dbName: process.env.DB_NAME,
  jwtSecret: process.env.JWT_KEY,
  dbURL: `postgresql://${process.env.DB_USR}:${process.env.DB_PWD}@${
    process.env.DB_HOST
  }/${process.env.DB_NAME}`,
  environment: process.env.ENVIRONMENT,
};

module.exports = config;