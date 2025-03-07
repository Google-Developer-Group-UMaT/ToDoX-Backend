const express = require("express");
const taskRoutes = require("./route");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors({ allowedHeaders: "*" ,origin: "*"}));

app.use(taskRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).send({
        error: {
            message,
            statusCode,
        },
    });
});

app.get("/api/auth", (req, res, next) => {
    // Authentication logic here
});

module.exports = app;
