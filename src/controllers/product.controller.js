const db = require("../models");
const Product = db.Product;
const Category = db.Category;
const User = db.User;
const { createObjectCsvWriter } = require('csv-writer');
const jwt = require("jsonwebtoken");
const XLSX = require('xlsx');
const csv = require('csv-parser');
const fs = require('fs');

// Create a Product
exports.createProduct = async (req, res) => {
    try {
        // Get the token from the Authorization header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided!" });
        }

        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId; // Extract userId from the token

        // Ensure user exists (optional, but recommended)
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Create the product and associate it with the user
        const productData = {
            ...req.body,
            userId: userId, // Add userId to the product data
        };

        const product = await Product.create(productData); // Create the product

        // Respond with the newly created product
        res.status(201).json(product);
    } catch (error) {
        console.error("Error creating product:", error.message);
        res.status(400).json({ error: error.message });
    }
};

// Get Products with Pagination, Ordering, and Search
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAndCountAll();
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
