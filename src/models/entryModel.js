module.exports = (sequelize, DataTypes) => {
  const Entry = sequelize.define("Entry", {
    entryName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false
    },
  });
  return Entry;
};
