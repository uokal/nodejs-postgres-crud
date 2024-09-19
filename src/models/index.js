const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Create Sequelize instance
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.user = require('./user.model.js')(sequelize, Sequelize.DataTypes);
db.category = require('./category.model.js')(sequelize, Sequelize.DataTypes);
db.product = require('./product.model.js')(sequelize, Sequelize.DataTypes);

// Define associations
db.user.hasMany(db.category, {
    as: 'categories',
    foreignKey: 'userId',
    sourceKey: 'userId' // Assuming userId is the primary key in the User model
});
db.category.belongsTo(db.user, {
    foreignKey: 'userId',
    as: 'user',
    targetKey: 'userId' // Ensures it references the correct key in User model
});

db.user.hasMany(db.product, {
    as: 'products',
    foreignKey: 'userId',
    sourceKey: 'userId' // Assuming userId is the primary key in the User model
});
db.product.belongsTo(db.user, {
    foreignKey: 'userId',
    as: 'user',
    targetKey: 'userId' // Ensures it references the correct key in User model
});

db.category.hasMany(db.product, {
    as: 'products',
    foreignKey: 'categoryId',
    sourceKey: 'categoryId' // Assuming categoryId is the primary key in the Category model
});
db.product.belongsTo(db.category, {
    foreignKey: 'categoryId',
    as: 'category',
    targetKey: 'categoryId' // Ensures it references the correct key in Category model
});

module.exports = db;
