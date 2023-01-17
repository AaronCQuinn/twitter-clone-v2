const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const User = require('../schemas/UserSchema');
const Post = require('../schemas/PostSchema');

router.get('/:username', async (req, res) => {
    const { username } = req.params;
    const user = req.cookies.token;
    const { _id } = jwt.decode(user);

    // Combine the database queries into a group reducing time to get adata.
    userProfile = await User.findOne({ username: username }, { email: 0, password: 0 })

    const posts = await Post.find({ postedBy: userProfile._id, replyTo: { $exists: false } })
        .populate({
          path: "postedBy", 
          select: '-password -email'
        })
        .populate({
          path: 'retweetData',
          populate: {
            path: 'postedBy',
            select: '-password -email'
          }
        })
        .populate({
          path: 'replyTo.postedBy',
          select: "username"
        })
        .sort({createdAt: '-1'}
    );

    if (!user) {
        return res.sendStatus(400);
    };
      
    return res.status(200).send({userProfile, posts});
})

router.get('/:username/replies', async (req, res) => {
    const { username } = req.params;
    twitterUser = await User.findOne({ username: username }, { email: 0, password: 0 })


    // Combine the database queries into a group reducing time to get adata.
    let posts = await Post.find({ postedBy: twitterUser._id, replyTo: { $exists: true } })
    .populate({
        path: "postedBy", 
        select: '-password -email'
    })
    .populate({
        path: 'retweetData',
        populate: {
            path: 'postedBy',
            select: '-password -email'
        }
    })
    .populate({
        path: 'replyTo',
    })
    .sort({createdAt: -1})
    .then(async response => {
      response = await User.populate(response, {path: "replyTo.postedBy", select: "username"})
      response = await User.populate(response, {path: "retweetData.postedBy", select: '-password -email'})
      return res.status(200).send(response);
    })
    .catch(error => {
      console.log(error);
    });
})

module.exports = router;