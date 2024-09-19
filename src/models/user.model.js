module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        userId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
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
            as: 'products',
            sourceKey: 'userId' // Refers to the primary key in User
        });
        User.hasMany(models.Category, {
            foreignKey: 'userId',
            as: 'categories',
            sourceKey: 'userId' // Refers to the primary key in User
        });
    };

    return User;
};
