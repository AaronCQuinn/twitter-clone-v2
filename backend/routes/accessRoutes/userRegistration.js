const express = require('express');
const router = express.Router();
const checkPassword = require('../../util/checkPassword');
const User = require('../../schemas/UserSchema');
const encryptPassword = require('../../util/encryptPassword');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res, next) => {
    // Remove any spacing around post values.
    const trimValues = {};
    Object.keys(req.body).forEach(key => {
        trimValues[key] = req.body[key].trim();
    });

    // Check to see all inputs have values.
    if (!Object.values(trimValues).every(Boolean)) {
        console.log("An input field didn't have any value.");
        return res.sendStatus(400);
    }

    const { regFirstName, regLastName, regUsername, regEmail, registerPassword, registerPasswordConf } = trimValues;

    // Both passwords must pass validation checks.
    if (!checkPassword(registerPassword) || !checkPassword(registerPasswordConf)) {
        console.log('Password did not pass validation check.');
        return res.sendStatus(400);
    }

    // Both passwords must match.
    if (registerPassword !== registerPasswordConf) {
        console.log('Password confirmation did not match.');
        return res.sendStatus(400);
    }

    // Check if either the username or email already exists.
    const existingUser = await User.findOne({$or: [{ username: regUsername }, { email: regEmail }]}).catch(() => {
        console.log("Error checking Mongo for pre-existing user.");
        return res.sendStatus(500);
    })

    if (existingUser) {
        console.log('User already exists in DB.');
        return res.sendStatus(409);
    }
    
    try {
        const user = await User.create({
            firstName: regFirstName, 
            lastName: regLastName, 
            username: regUsername, 
            email: regEmail, 
            password: await encryptPassword(registerPassword),
        })
        console.log('User successfully added to the database.');

        const {username, profilePicture, _id, likes} = user;
        const clientData = {
            username,
            profilePicture,
            _id,
            likes
        }

        const token = jwt.sign(clientData, process.env.JWT_SECRET);
        res.cookie("token", token, {
                httpOnly: true
            })
        return res.sendStatus(201);
    } catch(err) {
        console.log("Error writing user to the database: " + err);
        return res.sendStatus(500);
    }

})

module.exports = router;