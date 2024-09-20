const db = require("../models");
const Category = db.Category;
const User = db.User;

const jwt = require("jsonwebtoken");


// CRUD operations for Category
exports.createCategory = async (req, res) => {
    try {
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
        const categoryData = {
            ...req.body,
            userId: userId, // Add userId to the product data
        };

        const category = await Category.create(categoryData);
        res.status(200).send(category);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).send(categories);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.update(req.body, {
            where: { id: req.params.id }
        });
        res.status(200).send(category);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        await Category.destroy({ where: { id: req.params.id } });
        res.status(200).send({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
