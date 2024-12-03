const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log("Authorization Header Received:", authHeader);

    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        console.error("Access Token not found in Authorization Header");
        return res.status(401).json({ message: 'Access Token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                console.error("JWT Token has expired:", err);
                return res.status(401).json({ message: 'Session expired. Please log in again.' });
            }
            console.error("JWT Verification Failed:", err);
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.user = user;
        next();
    });
};

module.exports = authenticateToken;


