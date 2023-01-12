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
    const [twitterUser, posts] = await Promise.all([

        User.findOne({ username: username }, { email: 0, password: 0 }),

        Post.find({ postedBy: _id, replyTo: { $exists: false } })
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
          .sort({createdAt: '-1'})
      ]);

    if (!user) {
        return res.sendStatus(400);
    };
      
    return res.status(200).send({twitterUser, posts});
})

router.get('/:username/replies', async (req, res) => {
    const user = req.cookies.token;
    const { _id } = jwt.decode(user);

    // Combine the database queries into a group reducing time to get adata.
    let posts = await Post.find({ postedBy: _id, replyTo: { $exists: true } })
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
    .sort({createdAt: -1})

    return res.status(200).send({posts});
})

module.exports = router;