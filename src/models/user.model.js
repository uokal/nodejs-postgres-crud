module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        userId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    User.associate = (models) => {
        User.hasMany(models.Product, {
            foreignKey: 'userId',
            sourceKey: 'userId',
            as: 'products',
        });
        User.hasMany(models.Category, {
            foreignKey: 'userId',
            sourceKey: 'userId',
            as: 'categories',
        });
    };

    return User;
};
