const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");

router.post("/create", categoryController.createCategory);
router.get("/get", categoryController.getCategories);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
