const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Define models with explicit table names
db.User = require('./user.model.js')(sequelize, Sequelize.DataTypes);
db.Product = require('./product.model.js')(sequelize, Sequelize.DataTypes);
db.Category = require('./category.model.js')(sequelize, Sequelize.DataTypes);

// Define associations
db.User.hasMany(db.Product, { foreignKey: 'userId', sourceKey: 'userId', as: 'products' });
db.Product.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'userId', as: 'user' });

db.Category.hasMany(db.Product, { foreignKey: 'categoryId', as: 'products' });
db.Product.belongsTo(db.Category, { foreignKey: 'categoryId', as: 'category' });

module.exports = db;
