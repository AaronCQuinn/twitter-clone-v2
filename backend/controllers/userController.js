const User = require('../models/UserSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkPassword = require('../util/checkPassword');
const encryptPassword = require('../util/encryptPassword');
const issueClientData = require('../util/issueClientData');
const { trimRequestBodyValues } = require('../util/trimRequestBodyValues');

// DESCRIPTION - Logs user in to the app, issues cookie.
// route POST /api/users/user_login
// @access Public
const logUserIn = async(req, res) => {
    const trimValues = trimRequestBodyValues(req.body);

    // Check if both the the username and password fields have a value.
    if (!Object.values(trimValues).every(Boolean)) {
        return res.sendStatus(400);
    }

    const {loginUsername, loginPassword} = trimValues;
    try {
        const existingUser = await User.findOne({$or: [{ username: loginUsername }, { email: loginUsername }]})

        if (!existingUser) {
            return res.sendStatus(404);
        }

        const comparePass = await bcrypt.compare(loginPassword, existingUser.password);

        if (!comparePass) {
            return res.sendStatus(401);
        }

        const clientData = issueClientData(existingUser);

        const token = jwt.sign(clientData, process.env.JWT_SECRET);
        
        res.cookie('token', token, { httpOnly: true });

        return res.status(200).send(clientData);
    } catch(error) {
        return res.sendStatus(500);
    }
}

// DESCRIPTION - Registers user to the app, issues cookie.
// route POST /api/users/user_registration
// @access Public
const registerUser = async(req, res) => {
    const trimValues = trimRequestBodyValues(req.body);

    // Check to see all inputs have values.
    if (!Object.values(trimValues).every(Boolean)) {
        return res.sendStatus(400);
    }

    const { regFirstName, regLastName, regUsername, regEmail, registerPassword, registerPasswordConf } = trimValues;

    // Both passwords must pass validation checks.
    if (!checkPassword(registerPassword) || !checkPassword(registerPasswordConf)) {
        return res.sendStatus(400);
    }

    // Both passwords must match.
    if (registerPassword !== registerPasswordConf) {
        return res.sendStatus(400);
    }

    // Check if either the username or email already exists.
    const existingUser = await User.findOne({$or: [{ username: regUsername }, { email: regEmail }]}).catch(() => {
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

        const {username, profilePicture, _id, likes, retweets, firstName, lastName, following, followers} = user;
        const clientData = {
            username,
            profilePicture,
            _id,
            likes,
            retweets,
            firstName,
            lastName,
            following,
            followers
        }

        const token = jwt.sign(clientData, process.env.JWT_SECRET);
        res.cookie("token", token, {
                httpOnly: true
            })
        return res.sendStatus(201);
    } catch(err) {
        return res.sendStatus(500);
    }
}

// DESCRIPTION - Removes the active cookie from user.
// route GET /api/users/user_logout
// @access Public
const logUserOut = async(req, res) => {
    try {
        res.cookie('token', '', {maxAge: 1});
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
}

// DESCRIPTION - Verifies the user has a valid credential when navigating routes.
// route POST /api/users/user_authenication
// @access Private
const verifyUserAuth = async(req, res) => {
    const token = req.cookies?.token;
        
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        if (user) {
            const clientData = issueClientData(user);
            res.status(200).send(clientData);
        }
    } catch(error) {
        res.clearCookie('token');
        return res.sendStatus(401);
    }
}

module.exports = { logUserIn, registerUser, logUserOut, verifyUserAuth };