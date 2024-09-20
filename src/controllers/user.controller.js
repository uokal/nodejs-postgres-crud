const bcrypt = require("bcrypt");
const db = require('../models');
const User = db.User;
const Product = db.Product;
const Category = db.Category;


const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Username, password are required" });
        }

        // Check if the username already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user record in the database
        const newUser = await User.create({
            email,
            password: hashedPassword
        });

        // Return the newly created user
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Create JWT token with userId or id
        const token = jwt.sign(
            {
                userId: user.userId || user.id, // Ensure to include the correct identifier
                email: user.email
            },
            process.env.JWT_SECRET, // You should replace this with your own secret key
            { expiresIn: "1h" } // Token expiration time
        );

        // Respond with token and email
        res.json({ token, email: user.email });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


exports.getUserDetails = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).send({ message: "No token provided!" });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId; 
        // Fetch user with associated products
        const user = await User.findByPk(userId, {
            include: [
                { model: Product, as: 'products' },
                { model: Category, as: 'category' }, 
            ],
            attributes: { exclude: ['password'] } // Exclude the password from the response
        });

        // If user is not found
        if (!user) {
            return res.status(404).send({ message: "User not found!" });
        }
        // Send the user details
        res.status(200).send(user);
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).send({ message: error.message });
    }
};

