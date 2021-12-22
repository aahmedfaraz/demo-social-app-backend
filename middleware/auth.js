const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
    // Get Token
    const token = req.header('axiom-auth-token');
    // Check if token exist or not
    if(!token) return res.status(401).json({ msg : "Authorization Denied, token is missing" })
    // Check if token is valid or not
    try {
        const payload = jwt.verify(token, config.get("jwtSecret"));
        req.user = payload.user;
        next();
    } catch (err) {
        res.status(401).json({ msg : "Invalid Token" });
    }
}