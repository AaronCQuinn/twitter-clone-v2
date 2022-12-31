const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const Post = require('../schemas/PostSchema');
const User = require('../schemas/UserSchema');

router.get('/', (req, res) => {
    Post.find({}).sort({ createdAt: -1}).limit(10).exec(async (err, docs) => {
        response = await Post.populate(docs, {path: "postedBy", select: "profilePicture username firstName lastName"});
        return res.status(200).send(response);
    });
})

router.post('/', async(req, res) => {
    const user = req.cookies.token;
    const {username, _id} = jwt.decode(user);

    if (!req.body.content) {
        console.log('User ' + username + ' attempted to submit a tweet without any content.')
        return res.sendStatus(400);
    }

    let { content } = req.body;

    const postData = {
        content: content.trim(),
        postedBy: _id
    }

    Post.create(postData)
    .then(async response => {
        response = await User.populate(response, {path: "postedBy"})
        return res.status(201).send(response);
    })
    .catch(error => {
        console.log('User ' + username + 'encountered an error trying to write their post to Mongo: ' + error);
        return res.sendStatus(500);
    });
})

router.put('/:id/like', async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.sendStatus(400);
    }

    const reqToken = req.cookies?.token;
    if (!reqToken) {
        return res.sendStatus(401);
    }

    const user = jwt.verify(reqToken, process.env.JWT_SECRET);

    if (!user) {
        return res.statusMessage(401);
    }

    const isLiked = user.likes && user.likes.includes(id);

    // If user has already liked the post, it will pull it from the set, otherwise will add it.
    // The new flag returns the updated document rather then the one before the update.
    const returnUser = await User.findByIdAndUpdate(user._id, { [isLiked ? "$pull" : "$addToSet"]: {likes: id} }, { new: true })
    .catch(error => {
        console.error('User ' + user.username + " encountered an error while liking a tweet: " + error)
        res.sendStatus(400);
    })

    // Same thing here, we need to update the post's liked property to account for the user liking or unliking it.
    const updatePost = await Post.findByIdAndUpdate(id, { [isLiked ? "$pull" : "$addToSet"]: {likes: user._id} }, { new: true })
    .catch(error => {
        console.error('User ' + user.username + " encountered an error while liking a tweet: " + error)
        res.sendStatus(400);
    })

    // The session also needs to be updated so the client can read whether the status of the likes has changed, otherwise any attempt to like or unlike wouldn't work as the session still contains the old likes array.
    const {username, profilePicture, _id, likes} = returnUser;
    const clientData = {
        username, 
        profilePicture, 
        _id, 
        likes
    }

    // Reissue the JWT with the new info.
    const token = jwt.sign(clientData, process.env.JWT_SECRET);
    res.cookie("token", token, {
            httpOnly: true
        }
    )

    return res.status(201).send({updatePost, returnUser});
});

module.exports = router;