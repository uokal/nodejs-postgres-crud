const db = require("../models");
const Product = db.product;
const Category = db.category;
const { createObjectCsvWriter } = require('csv-writer');
const XLSX = require('xlsx');
const csv = require('csv-parser');
const fs = require('fs');

// Create a Product
exports.createProduct = async (req, res) => {
    try {
        const { userId, name, price, uniqueId, categoryId } = req.body;

        // Check if userId is provided
        if (!userId) {
            return res.status(400).send({ message: "userId is required." });
        }

        const product = await Product.create({
            userId,  // Ensure userId is included
            name,
            price,
            uniqueId,
            categoryId
        });
        res.status(200).send(product);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Get Products with Pagination, Ordering, and Search
exports.getProducts = async (req, res) => {
    const { page = 1, size = 10, order = 'ASC', search = '' } = req.query;
    try {
        const products = await Product.findAndCountAll({
            where: {
                [db.Sequelize.Op.or]: [
                    { name: { [db.Sequelize.Op.iLike]: `%${search}%` } },
                    { '$category.name$': { [db.Sequelize.Op.iLike]: `%${search}%` } }
                ]
            },
            limit: size,
            offset: (page - 1) * size,
            order: [['price', order]],
            include: [{ model: Category, as: "category" }]
        });
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Export Products in CSV
exports.exportProductsCSV = async (req, res) => {
    try {
        const products = await Product.findAll({ include: [{ model: Category, as: "category" }] });
        const csvWriter = createObjectCsvWriter({
            path: 'products.csv',
            header: [
                { id: 'category', title: 'Category' },
                { id: 'name', title: 'Product Name' },
                { id: 'price', title: 'Price' },
                { id: 'uniqueId', title: 'Unique ID' }
            ]
        });
        const records = products.map(product => ({
            category: product.category.name,
            name: product.name,
            price: product.price,
            uniqueId: product.uniqueId
        }));
        await csvWriter.writeRecords(records);
        res.download('products.csv');
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Export Products in XLSX
exports.exportProductsXLSX = async (req, res) => {
    try {
        const products = await Product.findAll({ include: [{ model: Category, as: "category" }] });
        const data = products.map(product => ({
            Category: product.category.name,
            ProductName: product.name,
            Price: product.price,
            UniqueID: product.uniqueId
        }));
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=products.xlsx');
        res.send(buffer);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Bulk Upload Products
exports.bulkUploadProducts = async (req, res) => {
    const userId = req.body.userId; // Ensure userId is provided in the request body
    try {
        if (!userId) {
            return res.status(400).send({ message: "userId is required." });
        }

        // Validate userId
        const user = await db.user.findByPk(userId);
        if (!user) {
            return res.status(400).send({ message: "Invalid userId." });
        }

        const results = [];
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', async (row) => {
                const category = await Category.findOne({ where: { name: row.category } });
                if (category) {
                    await Product.create({
                        name: row.name,
                        price: row.price,
                        uniqueId: row.uniqueId,
                        categoryId: category.id,
                        userId // Assign userId from the request body
                    });
                }
            })
            .on('end', () => {
                res.status(200).send({ message: "Bulk upload successful" });
            });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
