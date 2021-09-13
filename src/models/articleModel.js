module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define("Article", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.STRING,
      allowNull: false,
    },
    sourceName: {
        type: DataTypes.STRING,
      allowNull: false,
    },
    publishedAt: {
        type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Article;
};
