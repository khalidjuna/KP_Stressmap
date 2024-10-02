import jwt from "jsonwebtoken";

export const verifyTokenAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401).json({ message: "Akses ditolak, token tidak tersedia" });
    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if(err) return res.sendStatus(403);
            req.username = decoded.username;
            next();
        })
        
    } catch (error) {
        res.status(400).json({ message: "Token tidak valid" });
    }
};