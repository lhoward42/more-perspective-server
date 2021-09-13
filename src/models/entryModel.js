module.exports = (sequelize, DataTypes) => {
  const Entry = sequelize.define("Entry", {
    entryName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    articleTitles: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    contents: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    sources: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
  });
  return Entry;
};
