const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        res.sendStatus(401);
    }

    try {
        req.cookies.decodedToken = jwt.decode(token);

        next();
    } catch (error) {
        res.sendStatus(401);
    }
}

module.exports = { verifyToken };