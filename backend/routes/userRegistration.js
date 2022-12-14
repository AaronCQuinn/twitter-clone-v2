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
    if (Object.values(trimValues).every(Boolean)) {
        console.log('here')
        let firstName = req.body.formValues.regFirstName.trim();
        let lastName = req.body.formValues.regLastName.trim();
        let username = req.body.formValues.regUsername.trim();
        let email = req.body.formValues.regEmail.trim();
        let password = req.body.formValues.registerPassword;
        let passwordConf = req.body.formValues.registerPasswordConf;

    } else {
        res.status(200).send({
            error: "1"
        })
    }
})

module.exports = router;