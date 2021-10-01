const { Sequelize } = require("sequelize");
const { dbURL } = require("../config");

const sequelize = new Sequelize(process.env.ENVIRONMENT === 'development' ? dbURL : process.env.DATABASE_URL, { dialect: "postgres" });

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

async function syncDb(sequelize, options) {
  const { force, alter } = options;
  try {
    if (force) await sequelize.sync({ force: true });
    else if (alter) await sequelize.sync({ alter: true });
    else await sequelize.sync();
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  sequelize,
  syncDb,
};
