const {fadmin} = require("../config/firebase");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Extract token
        if (!token) {
            return res.status(401).send("Unauthorized: No token provided");
        }

        req.user = await fadmin.auth().verifyIdToken(token); // Attach user info to request
        next();
    } catch (error) {
        res.status(401).send("Unauthorized: Invalid token");
    }
};

module.exports = authMiddleware;
