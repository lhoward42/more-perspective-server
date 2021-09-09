const Sequelize = require('sequelize');
const { dbURL  } = require("../config/index")

const sequelize = new Sequelize(
    dbURL, 
    {dialect: "postgres"}
    )
    
  
  module.exports = sequelize;