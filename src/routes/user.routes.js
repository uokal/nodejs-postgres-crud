const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const verifyToken = require("../middleware/auth.middleware");

router.post("/register", userController.register);
router.get("/", verifyToken, userController.getUserDetails);
router.post("/login", userController.login);

module.exports = router;
