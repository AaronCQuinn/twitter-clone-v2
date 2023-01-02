const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const Post = require('../schemas/PostSchema');
const User = require('../schemas/UserSchema');

router.get('/', (req, res) => {
    Post.find()
    .populate('postedBy')
    .populate('retweetData')
    .sort({ createdAt: -1})
    .limit(10)
    .then(async response => {
        response = await User.populate(response, {path: "retweetData.postedBy"} )
        return res.status(200).send(response);
    })
    .catch(error => {
        console.log(error);
    })
    ;
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
        res.sendStatus(500);
    })

    // Same thing here, we need to update the post's liked property to account for the user liking or unliking it.
    const updatePost = await Post.findByIdAndUpdate(id, { [isLiked ? "$pull" : "$addToSet"]: {likes: user._id} }, { new: true })
    .catch(error => {
        console.error('User ' + user.username + " encountered an error while liking a tweet: " + error)
        res.sendStatus(500);
    })

    // The session also needs to be updated so the client can read whether the status of the likes has changed, otherwise any attempt to like or unlike wouldn't work as the session still contains the old likes array.
    const {username, profilePicture, _id, likes, retweets} = returnUser;
    const clientData = {
        username, 
        profilePicture, 
        _id, 
        likes,
        retweets
    }

    // Reissue the JWT with the new info.
    const token = jwt.sign(clientData, process.env.JWT_SECRET);
    res.cookie("token", token, {
            httpOnly: true
        }
    )

    return res.status(201).send({updatePost, returnUser});
});

router.post('/:id/retweet', async (req, res) => {
    const incomingRTPostId = req.body.id;

    if (!incomingRTPostId) {
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

    // Check to see if we're un-retweeting. In this case it would be posted (retweeted) by the user, and the retweet data would contain the posts ID.
    const deletedPost = await Post.findOneAndDelete({ postedBy: user._id, retweetData: incomingRTPostId})
    .catch(error => {
            console.error('User ' + user.username + " encountered an error while retweeting a tweet: " + error)
            res.sendStatus(500);
        }
    )

    const option = deletedPost != null ? "$pull" : "$addToSet";
    let repost = deletedPost;
    
    // If there was no post found, that means we need to create the retweet, hence adding a new post.
    if (repost == null) {
        repost = await Post.create({ postedBy: user._id, retweetData: incomingRTPostId })
        .catch(error => {
                console.log('Error creating a retweet for user ' + user.username + ". Error: " + error);
                res.sendStatus(500);
            }
        )
    }
    
    // If user has already retweeted the post, it will pull it from the set, otherwise will add it.
    // The new flag returns the updated document rather then the one before the update.
    const returnUser = await User.findByIdAndUpdate(user._id, { [option]: {retweets: incomingRTPostId} }, { new: true })
    .catch(error => {
        console.error('User ' + user.username + " encountered an error while liking a tweet: " + error)
        res.sendStatus(500);
    });
                
    // Same thing here, we need to update the post's retweet property to account for the user retweeting or unretweeting it.
    const updatePost = await Post.findByIdAndUpdate(incomingRTPostId, { [option]: { retweetUsers: user._id} }, { new: true })
    .catch(error => {
            console.error('User ' + user.username + " encountered an error while retweeting a tweet: " + error)
            res.sendStatus(500);
        })

    const {username, profilePicture, _id, likes, retweets} = returnUser;
    const clientData = {
        username, 
        profilePicture, 
        _id, 
        likes,
        retweets
    };
    
    // Reissue the JWT with the new info.
    const token = jwt.sign(clientData, process.env.JWT_SECRET);
    res.cookie("token", token, {
            httpOnly: true
        }
    )

    return res.status(201).send({updatePost, returnUser});
})

module.exports = router;