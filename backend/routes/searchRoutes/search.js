const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const User = require('../../models/UserSchema');
const Post = require('../../models/PostSchema');

router.get('/users', async (req, res) => {
    const searchTerm = req.query.term;

    if (!searchTerm) {
        return res.sendStatus(400);
    }

    const reqToken = req.cookies?.token;
    if (!reqToken) {
        return res.sendStatus(401);
    }

    const user = jwt.verify(reqToken, process.env.JWT_SECRET);
    if (!user) {
        return res.sendStatus(401);
    }

    try {
      await User.find({
            $or: [
            { firstName: { $regex: searchTerm, $options: "i"}},
            { lastName: { $regex: searchTerm, $options: "i"}},
            { username: { $regex: searchTerm, $options: "i"}}
            ] 
        })
        .select('-email -password')
        .then(async response => {
            return res.status(200).send(response);
        })
    } catch(error) {
        console.error(error);
        return res.sendStatus(500);
    }
})

router.get('/posts', async (req, res) => {
    const searchTerm = req.query.term;

    if (!searchTerm) {
        return res.sendStatus(400);
    }

    const reqToken = req.cookies?.token;
    if (!reqToken) {
        return res.sendStatus(401);
    }

    const user = jwt.verify(reqToken, process.env.JWT_SECRET);
    if (!user) {
        return res.sendStatus(401);
    }

    try {
       await Post.find({content: {$regex: searchTerm, $options: "i" }})
        .populate({ 
            path: 'postedBy', 
            select: '-password -email' 
        }).populate(['retweetData', 'replyTo']) // combine populate calls into a single call
        .sort({ createdAt: -1 })
        .limit(15)
        .then(async response => {
            response = await User.populate(response, {path: "replyTo.postedBy", select: "username"})
            response = await User.populate(response, {path: "retweetData.postedBy", select: '-password -email'})
            return res.status(200).send(response);
        })
    } catch(error) {
        console.error(error);
        return res.sendStatus(500);
    }
})

module.exports = router;