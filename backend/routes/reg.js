const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

router.post("/", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const isUser = await User.findOne({ email });
        if (isUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedpassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedpassword
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;