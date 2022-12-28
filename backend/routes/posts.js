const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')

router.get('/', (req, res) => {

})

router.post('/', (req, res) => {
    const user = req.cookies.token;
    console.log(jwt.decode(user));

    console.log(user);
    res.send('hehe')
})

module.exports = router;