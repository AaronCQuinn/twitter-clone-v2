const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    try {
        res.cookie('token', '', {maxAge: 1});
        res.sendStatus(200);
    } catch (error) {
        console.log('Error logging user out: ' + error);
        res.sendStatus(500);
    }
})

module.exports = router;