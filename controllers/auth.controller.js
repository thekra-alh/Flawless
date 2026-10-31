
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
require("dotenv").config();

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        const [existingUsers] = await db.execute(
            "SELECT user_id FROM User WHERE email = ?",
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.execute(
            "INSERT INTO User (full_name, email, password_hash) VALUES (?, ?, ?)",
            [name, email, hashedPassword]
        );

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: result.insertId,
                name,
                email
            }
        });
    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            success: false,
            message: "Registration failed"
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const [users] = await db.execute(
            "SELECT user_id, full_name, email, password_hash FROM User WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user.user_id,
                email: user.email
            },
            process.env.JWT_SECRET || "flawless_secret_key",
            {
                expiresIn: "1d"
            }
        );

        return res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.user_id,
                name: user.full_name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
};

module.exports = { register, login };
