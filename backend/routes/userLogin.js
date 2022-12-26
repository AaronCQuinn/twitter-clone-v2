const express = require('express');
const router = express.Router();
const checkPassword = require('../util/checkPassword');
const User = require('../schemas/UserSchema');
const encryptPassword = require('../util/encryptPassword');
const jwt = require('jsonwebtoken');

router.post('/', async(req, res) => {
    const trimValues = {};
    Object.keys(req.body).forEach(key => {
        trimValues[key] = req.body[key].trim();
    });

    if (!Object.values(trimValues).every(Boolean)) {
        console.log("An input field didn't have any value.");
        return res.sendStatus(400);
    }

    const {loginUsername, loginPassword} = trimValues;

    if (loginUsername && loginPassword) {
        
    }
})