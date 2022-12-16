const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');

router.post('/', (req, res, next) => {
    const { formValues } = req.body;

    // Remove any spacing around post values.
    const trimValues = {};
    Object.keys(formValues).forEach(key => {
        trimValues[key] = formValues[key].trim();
    });

    // Check to see all inputs have values.
    if (!Object.values(trimValues).every(Boolean)) {
        res.status(200).send({
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
        res.status(200).send({
            status: true,
            text: "Both passwords must be a minimum of 8 characters with an upper and lowercase character, as well as a number and symbol"
        })
    }

    // Both passwords must match.
    if (password !== passwordConf) {
        res.status(200).send({
            status: true,
            text: "Both passwords must match in order to register."
        })
    }

})

function checkPassword(str) {
    const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(str);
}

module.exports = router;