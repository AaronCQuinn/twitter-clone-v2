const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

router.post('/', (req, res, next) => {
    console.log(req.body);
})

module.exports = router;