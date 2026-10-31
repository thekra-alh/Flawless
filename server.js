const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const analysisRoutes = require("./routes/analysis.routes");

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/analysis", analysisRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Flawless Backend is running"
    });
});

app.listen(PORT, () => {
    console.log(`Flawless Backend is running on port ${PORT}`);
});