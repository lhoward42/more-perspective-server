module.exports = (sequelize, DataTypes) => {
  const Entry = sequelize.define("Entry", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });
  return Entry;
};
