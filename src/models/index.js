const { sequelize, synceDb } = require("../db");
const { DataTypes } = require("sequelize");

const DefineUser = require("./userModel");
const DefineArticle = require("./articleModel");
const DefineEntry = require("./entryModel");

const User = DefineUser(sequelize, DataTypes);
const Article = DefineArticle(sequelize, DataTypes);
const Entry = DefineEntry(sequelize, DataTypes);

User.hasMany(Entry);
Entry.belongsTo(User);

Entry.hasMany(Article);
Article.belongsTo(Entry);

synceDb(sequelize, { alter: true });

module.exports = { User, Article, Entry };
