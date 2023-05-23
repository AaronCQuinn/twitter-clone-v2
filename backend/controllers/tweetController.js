const jwt = require('jsonwebtoken');
const Post = require('../models/PostSchema');
const User = require('../models/UserSchema');

// DESCRIPTION - Adds a tweet.
// route POST /api/tweets/post_tweet/:id
// @access Private
const postTweet = async(req, res) => {
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
        response = await User.populate(response, {path: "postedBy", select: '-password -email'})
        return res.status(201).send(response);
    })
    .catch(error => {
        console.log('User ' + username + 'encountered an error trying to write their post to Mongo: ' + error);
        return res.sendStatus(500);
    });
}

// DESCRIPTION - Posts a reply to a tweet.
// route POST /api/tweets/post_reply/:id
// @access Private
const postReply = async(req, res) => {
    const user = req.cookies.token;
    const {_id} = jwt.decode(user);

    if (!req.body.reply || !req.body.id) {
        return res.sendStatus(400);
    }

    let { reply, id } = req.body;

    const postData = {
        content: reply.trim(),
        postedBy: _id,
        replyTo: id
    };

    Post.create(postData)
    .then(async response => {
        await response.populate('replyTo')
        response = await User.populate(response, {path: "postedBy", select: '-password -email'})
        response = await User.populate(response, {path: "replyTo.postedBy", select: '-password -email'})
        return res.status(201).send(response);
    })
    .catch(() => {
        return res.sendStatus(500);
    });
}

// DESCRIPTION - Deletes a tweet.
// route DELETE /api/tweets/delete_tweet/:id
// @access Private
const deleteTweet = async(req, res) => {
    const postId = req.params.id;
    const user = req.cookies.token;
    const { _id } = jwt.decode(user);
  
    const post = await Post.findById(postId);
    if (!post || post.retweetData) {
      return res.sendStatus(404);
    }
    
    // The user who's logged in must be the one who posted the tweet, to protect unauthorized API calls to delete another users tweets.
    if (post.postedBy._id.toString() === _id) {
      await post.delete();
      res.sendStatus(202);
    } else {
      res.sendStatus(401);
    }
}

// DESCRIPTION - Pins a tweet.
// route PUT /api/tweets/pin_tweet/:id
// @access Private
const pinTweet = async(req, res) => {
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
}

// DESCRIPTION - Likes a tweet.
// route PUT /api/tweets/like_tweet/:id
// @access Private
const likeTweet = async(req, res) => {
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
}

// DESCRIPTION - Retweet a tweet.
// route POST /api/tweets/retweet_tweet/:id
// @access Private
const retweetTweet = async(req, res) => {
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
}

module.exports = { deleteTweet, pinTweet, postTweet, postReply, likeTweet, retweetTweet };