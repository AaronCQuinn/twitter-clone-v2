const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const User = require('../schemas/UserSchema');
const Post = require('../schemas/PostSchema');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const upload = multer({ dest: "uploads/" });
const issueClientData = require('../util/issueClientData');

router.get('/:username', async (req, res) => {
    const { username } = req.params;
    const user = req.cookies.token;

    if (!user) {
      return res.sendStatus(401);
    }

    // Combine the database queries into a group reducing time to get adata.
    userProfile = await User.findOne({ username: username }, { email: 0, password: 0 })

    let posts = await Post.find({ postedBy: userProfile._id, replyTo: { $exists: false } })
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

    const pinnedPosition = posts.findIndex(post => post.pinned === true);
    const removedPinned = posts.splice(pinnedPosition, 1);
    posts.unshift(removedPinned[0]);

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
      return res.status(200).send({posts: response});
    })
    .catch(error => {
      console.log(error);
    });
})

router.get('/:username/following', async (req, res) => {
  const { username } = req.params;
  const twitterUser = await User.findOne({ username: username }, { email: 0, password: 0 }).populate('following', '_id firstName lastName username profilePicture description');
  res.status(200).send(twitterUser.following);
})

router.get('/:username/followers', async (req, res) => {
  const { username } = req.params;
  const twitterUser = await User.findOne({ username: username }, { email: 0, password: 0 }).populate('followers', '_id firstName lastName username profilePicture description');
  res.status(200).send(twitterUser.followers);
})

router.post('/:username/profilePicture', upload.single('profilePictureImage'), async (req, res) => {
  const user = req.cookies.token;
  const { username, _id } = jwt.decode(user);
  const requestedUsername = req.params.username;

  if (username !== requestedUsername) {
    return res.sendStatus(401);
  }

  if (!req.file) {
    return res.sendStatus(400);
  }

  const filepath = `/backend/uploads/${req.file.filename}.png`;
  const targetPath = path.join(__dirname, `../../${filepath}`);

  fs.rename(req.file.path, targetPath, error => {
    if (error) {
      console.log(error);
      return res.sendStatus(400);
    }
  });

  const returnUser = await User.findOneAndUpdate(_id, {profilePicture: `/api/uploads/images/${req.file.filename}.png` }, { new: true });
  const clientData = issueClientData(returnUser);
  const token = jwt.sign(clientData, process.env.JWT_SECRET);
  res.cookie('token', token, { httpOnly: true })

  console.log(clientData);
  return res.status(200).send(clientData);
})

router.post('/:username/coverPhoto', upload.single('profilePictureImage'), async (req, res) => {
    const user = req.cookies.token;
    const { username, _id } = jwt.decode(user);
    const requestedUsername = req.params.username;

    if (username !== requestedUsername) {
      return res.sendStatus(401);
    }

    if (!req.file) {
      return res.sendStatus(400);
    }

    const filepath = `/backend/uploads/${req.file.filename}.png`;
    const targetPath = path.join(__dirname, `../../${filepath}`);

    fs.rename(req.file.path, targetPath, error => {
      if (error) {
        console.log(error);
        return res.sendStatus(400);
      }
    });

    const returnUser = await User.findOneAndUpdate(_id, { coverPhoto: `/api/uploads/images/${req.file.filename}.png` }, { new: true });
    const clientData = issueClientData(returnUser);
    const token = jwt.sign(clientData, process.env.JWT_SECRET);
    res.cookie('token', token, { httpOnly: true })

    console.log(clientData);
    return res.status(200).send(clientData);
})

module.exports = router;