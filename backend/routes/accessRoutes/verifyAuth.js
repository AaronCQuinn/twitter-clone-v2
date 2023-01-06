const express = require('express');
const app = express();
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    const token = req.cookies?.token;
    
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        if (user) {
            const clientData = {
                username: user.username,
                profilePicture: user.profilePicture,
                likes: user.likes,
                retweets: user.retweets,
                _id: user._id
            }
            res.status(200).send(clientData);
        } else {
            res.clearCookie('token');
            return res.sendStatus(401);
        }
    } catch(error) {
        res.clearCookie('token');
        return res.sendStatus(401);
    }
})

module.exports = router;