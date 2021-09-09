const { DataTypes } = require("sequelize");
const db = require("../db/index");

const User = db.define("user", {
    userName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    confirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    confirmationCode: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
});

module.exports = User;