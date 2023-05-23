const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema');
const Post = require('../models/PostSchema');

const INITIAL_TWEETS_TO_FETCH = 10;

// DESCRIPTION - Fetchs the most recent tweets from the logged in user's following list.
// route GET /api/tweets/main_feed
// @access Private
const fetchUserMainFeed = async(req, res) => {
    const user = req.cookies.token;
    const { following, _id } = jwt.decode(user);
    following.push(_id);

    Post.find({ postedBy: { $in: following } })
    .populate({ 
        path: 'postedBy', 
        select: '-password -email' 
    }).populate(['retweetData', 'replyTo']) // combine populate calls into a single call
    .sort({ createdAt: -1 })
    .limit(INITIAL_TWEETS_TO_FETCH)
    .then(async response => {
        response = await User.populate(response, {path: "replyTo.postedBy", select: "username"})
        response = await User.populate(response, {path: "retweetData.postedBy", select: '-password -email'})
        return res.status(200).send(response);
    })
    .catch(() => {
        return res.sendStatus(500);
    });
}

// DESCRIPTION - Fetchs a specific tweet that the user has clicked on for a focused view.
// route POST /api/tweets/focused_tweet/:id
// @access Private
const fetchTweet = async(req, res) => {
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
    .catch(() => console.error('Error fetching replies to single tweet.'))

    res.status(200).send({tweet, replies: replies});
}

module.exports = { fetchUserMainFeed, fetchTweet };