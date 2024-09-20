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
            type: DataTypes.STRING
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users', // Make sure this is the correct model name
                key: 'userId'
            }
        }
    });
    Product.associate = (models) => {
        Product.belongsTo(models.User, {
            foreignKey: 'userId',
            targetKey: 'userId',
            as: 'user'
        });
    };

    return Product;
};