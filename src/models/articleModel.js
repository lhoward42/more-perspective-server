module.exports = (sequelize, DataTypes) => {
    const Article = sequelize.define("Article", {
        title:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
    })
    return Article
}