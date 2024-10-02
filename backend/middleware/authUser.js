import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: "Akses ditolak, token tidak tersedia" });
    }

    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Token tidak valid" });
            }

            if (decoded.role !== "User") {
                return res.status(403).json({ message: "Akses ditolak, peran tidak sah" });
            }

            req.username = decoded.username; // Store the username for further use
            req.role = decoded.role;         // Store the role if needed later
            next(); // Proceed to the next middleware or route handler
        });
    } catch (error) {
        res.status(400).json({ message: "Token tidak valid" });
    }
};

export default authUser;
