const db = require("../models");
const Category = db.category;

// CRUD operations for Category
exports.createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
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
