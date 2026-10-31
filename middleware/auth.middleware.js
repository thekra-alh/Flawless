
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Authentication token is required."
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "flawless_secret_key"
        );

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired authentication token."
        });
    }
};

module.exports = authenticateToken;
