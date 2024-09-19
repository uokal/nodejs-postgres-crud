module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        categoryId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    return Category;
};
