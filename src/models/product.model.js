module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        productId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
        },
        uniqueId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            unique: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users', // Name of the table in the database
                key: 'userId'
            }
        },
        categoryId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Categories', // Name of the table in the database
                key: 'categoryId'
            }
        }
    });

    return Product;
};
