const db = require("../models");
const User = db.user;
const bcrypt = require("bcryptjs");

// Create or Update User
exports.createOrUpdateUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ where: { email } });

        if (user) {
            user.password = await bcrypt.hash(password, 10);
            await user.save();
        } else {
            user = await User.create({ email, password });
        }

        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
