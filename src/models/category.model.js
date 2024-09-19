module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define("Category", {
        categoryId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        uniqueId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            unique: true,
        },
    });

    Category.associate = (models) => {
        Category.belongsTo(models.User, {
            foreignKey: "userId",
            as: "user",
            targetKey: 'userId' // Refers to the primary key in User
        });
        Category.hasMany(models.Product, {
            as: "products",
            foreignKey: "categoryId",
            sourceKey: 'categoryId' // Refers to the primary key in Category
        });
    };

    return Category;
};
