const express = require('express');
const app = express();
const router = express.Router();
const jwt = require('jsonwebtoken');
const issueClientData = require('../../util/issueClientData');

router.get('/', (req, res) => {
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
})

module.exports = router;