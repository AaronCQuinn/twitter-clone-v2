const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const Post = require('../schemas/PostSchema');
const User = require('../schemas/UserSchema');

router.get('/:id', async (req, res) => {
    let tweet = await Post.findById(req.params.id)
    .populate(['postedBy', 'retweetData'])
    .sort({ "createdAt": -1 })
    .catch(error => console.error("Error fetching single tweet " + req.params.id + " " + error))

    tweet = await User.populate(tweet, { path: "retweetData.postedBy", select: '-password -email'})
    res.status(200).send(tweet);
})


module.exports = router;