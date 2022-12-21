const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const checkPassword = require('../util/checkPassword');
const User = require('../schemas/UserSchema');
const bcrypt = require('bcrypt');
const encryptPassword = require('../util/encryptPassword');

router.post('/', async (req, res, next) => {
    const { formValues } = req.body;
    
    // Remove any spacing around post values.
    const trimValues = {};
    Object.keys(formValues).forEach(key => {
        trimValues[key] = formValues[key].trim();
    });

    // Check to see all inputs have values.
    if (!Object.values(trimValues).every(Boolean)) {
        console.log("An input field didn't have any value.");
        return res.status(400).send();
    }

    let firstName = req.body.formValues.regFirstName.trim();
    let lastName = req.body.formValues.regLastName.trim();
    let username = req.body.formValues.regUsername.trim();
    let email = req.body.formValues.regEmail.trim();
    let password = req.body.formValues.registerPassword;
    let passwordConf = req.body.formValues.registerPasswordConf;


    // Both passwords must pass validation checks.
    if (!checkPassword(password) || !checkPassword(passwordConf)) {
        console.log('Password did not pass validation check.');
        return res.status(400).send();
    }

    // Both passwords must match.
    if (password !== passwordConf) {
        console.log('Password confirmation did not match.');
        return res.status(400).send();
    }

    // Check if either the username or email already exists.
    const existingUser = await User.findOne({$or: [{ username: username }, { email: email }]}).catch(() => {
        console.log("Error checking Mongo for pre-existing user.");
        return res.status(500).send();
    })

    if (existingUser) {
        console.log('User already exists in DB.');
        return res.status(409).send();
    }
    
    User.create({
        firstName,
        lastName,
        username,
        email,
        password: await encryptPassword(password),
    })
    .then(() => { 
        console.log("User successfully created.");
        return res.status(201).send();
    })
    .catch(err => {
        console.log("Error writing user to the database: " + err);
        return res.status(500).send();
    })

})

module.exports = router;