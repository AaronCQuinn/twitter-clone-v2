const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/images/:path', async (req, res) => {
    res.sendFile(path.join(__dirname, '../../uploads/' + req.params.path))
})

module.exports = router;