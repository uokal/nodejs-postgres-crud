const express = require("express");
const multer = require('multer');
const router = express.Router();
const productController = require("../controllers/product.controller");
const upload = multer({ dest: 'uploads/' });
router.post("/create", productController.createProduct);
router.post("/bulk-upload", upload.single('file'), productController.bulkUploadProducts);
router.get("/get", productController.getProducts);
router.get("/export-csv", productController.exportProductsCSV);

module.exports = router;
