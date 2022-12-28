const express = require('express');
const router = express.Router();
const User = require('../../schemas/UserSchema');
const bcrypt = require('bcrypt');
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
        const existingUser = 
        await User.findOne({$or: [{ username: loginUsername }, { email: loginUsername }]})
        .catch(() => {
            console.log("Error checking Mongo for pre-existing user.");
            return res.sendStatus(500);
        })

        if (!existingUser) {
            console.log('User not found in the database.')
            return res.sendStatus(404);
        }

        const comparePass = await bcrypt.compare(loginPassword, existingUser.password);

        if (!comparePass) {
            console.log('User entered the wrong password.');
            return res.sendStatus(401);
        }

        const {username, profilePicture, _id} = existingUser;
        const clientData = {
            username,
            profilePicture,
            _id
        }

        console.log("User provided correct credentials.");
        const token = jwt.sign(clientData, process.env.JWT_SECRET);
        res.cookie('token', token, {
            httpOnly: true
        })
        return res.sendStatus(201);
    }
})

module.exports = router;