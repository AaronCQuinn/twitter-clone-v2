const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        res.sendStatus(401);
        return;
    }

    try {
        req.cookies.decodedToken = jwt.decode(token);
        next();
    } catch (error) {
        res.sendStatus(401);
    }
}

module.exports = { verifyToken };