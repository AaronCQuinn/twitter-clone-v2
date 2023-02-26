const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const Post = require('../schemas/PostSchema');
const User = require('../schemas/UserSchema');

router.get('/:id', async (req, res) => {
  // Find the tweet that is focused.
  let tweet = await Post.findById(req.params.id)
    .populate(['postedBy', 'retweetData', 'replyTo'])
    .sort({"createdAt": -1 })
    .catch(error => console.error("Error fetching single tweet " + req.params.id + " " + error));

    let replies = await Post.find({ replyTo: req.params.id })
    .populate([
      { path: 'postedBy', select: '-password -email' },
      { path: 'retweetData.postedBy', select: '-password -email' },
      { path: 'replyTo', select: '-password -email', populate: { path: 'postedBy', model: 'User' } },
    ])

    res.status(200).send({tweet, replies: replies});
})


router.delete('/:id', async (req, res) => {
    const postId = req.params.id;
    const user = req.cookies.token;
    const { _id } = jwt.decode(user);
  
    const post = await Post.findById(postId);
    if (!post || post.retweetData) {
      return res.sendStatus(404);
    }
  
    if (post.postedBy._id.toString() === _id) {
      await post.delete();
      res.sendStatus(202);
    } else {
      res.sendStatus(401);
    }
});

router.put('/:id', async (req, res, next) => {
  const postId = req.params.id;
  const user = req.cookies.token;
  const { _id } = jwt.decode(user);
  
  const post = await Post.findById(postId);
  if (!post || post.retweetData) {
    return res.sendStatus(404);
  }

  if (post.pinned) {
    try {
      await Post.updateOne({_id: postId}, { $set: { pinned: false } });    
      return res.sendStatus(204);
    } catch(error) {
      return res.sendStatus(500);
    }
  }

  if (post.postedBy._id.toString() === _id) {
    await Post.updateMany({postedBy: _id}, { $set: {pinned: false }});
    await Post.updateOne({_id: postId}, { $set: { pinned: true } });    
    return res.sendStatus(204);
  } else {
    return res.sendStatus(401);
  }
})
  


module.exports = router;