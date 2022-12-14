const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');

router.post('/', (req, res, next) => {
    const { formValues } = req.body;

    // Check to see all inputs have values.
    if (Object.values(req.body.formValues).every(Boolean)) {

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