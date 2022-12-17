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
        return res.status(400).send({
            status: true,
            text: "All fields must be submitted with a valid value in order to register."
        })
    }

    let firstName = req.body.formValues.regFirstName.trim();
    let lastName = req.body.formValues.regLastName.trim();
    let username = req.body.formValues.regUsername.trim();
    let email = req.body.formValues.regEmail.trim();
    let password = req.body.formValues.registerPassword;
    let passwordConf = req.body.formValues.registerPasswordConf;


    // Both passwords must pass validation checks.
    if (!checkPassword(password) || !checkPassword(passwordConf)) {
        return res.status(400).send({
            status: true,
            text: "Both passwords must be a minimum of 8 characters with an upper and lowercase character, as well as a number and symbol"
        })
    }

    // Both passwords must match.
    if (password !== passwordConf) {
        return res.status(400).send({
            status: true,
            text: "Both passwords must match in order to register."
        })
    }

    // Check if either the username or email already exists.
    if (await User.findOne({$or: [{ username: username }, { email: email }]}).catch(error => {
        console.log(error);
        return res.status(500).send({
            status: true,
            text: "There was a server error. Please try again."
        })}))
     {
        return res.status(400).send({
            status: true,
            text: "There is already a user registered under this username or email."
        })
    }
   
    User.create({
        firstName,
        lastName,
        username,
        email,
        password: await encryptPassword(password),
    }).
    then(() => {
        return res.status(200).send({
            status: true,
            text: "User successfully registered."
        })}
    )
    .catch(err => {
        console.log("Error writing user to the database: " + err);
        return res.status(500).send({
            status: true,
            text: "There was a server error. Please try again."
        })
    })
})

module.exports = router;