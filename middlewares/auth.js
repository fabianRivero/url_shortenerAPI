import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Access denied. No token provided or invalid format." });
    }

    const token = authHeader.replace("Bearer ", "");

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; 
        next();
    } catch (error) {
        res.status(400).json({ error: "Invalid token." });
    }
}