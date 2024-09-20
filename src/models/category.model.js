module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users', // Make sure this is the correct model name
                key: 'userId'
            }
        }
    });
    Category.associate = (models) => {
        Category.belongsTo(models.User, {
            foreignKey: 'userId',
            targetKey: 'userId',
            as: 'user'
        });
    };

    return Category;
};