const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const User = require('../schemas/UserSchema');

router.get('/:username', async (req, res) => {
    const { username } = req.params;
    let user = await User.findOne({ username: username }, { email: 0, password: 0 })
    .populate(['retweets'])
    .sort({ "createdAt": -1 })
    .catch(error => console.error("Error fetching single tweet " + req.params.id + " " + error))

    user = await User.populate(user, { path: "retweets.postedBy", select: '-password -email'});

    res.status(200).send(user);
})

module.exports = router;