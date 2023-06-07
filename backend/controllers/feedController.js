const Post = require('../models/PostSchema');
const INITIAL_TWEETS_TO_FETCH = 10;

// DESCRIPTION - Fetchs the most recent tweets from the logged in user's following list.
// route GET /api/tweets/main_feed
// @access Private
const fetchUserMainFeed = async(req, res) => {
    let { following: UserLoggedInFollowing, _id: UserLoggedInId } = req.cookies.decodedToken;
    UserLoggedInFollowing.push(UserLoggedInId);

    try { 
        let UserLoggedInFeed = await Post.find({ 
        postedBy: { $in: UserLoggedInFollowing }})
        .limit(INITIAL_TWEETS_TO_FETCH)
        .populate(['replyTo', 'postedBy'])
        .populate( { path: 'retweetData', populate: { path: 'postedBy', model: 'User'}} )
        .sort({ createdAt: -1 })

        return res.status(200).send(UserLoggedInFeed);
    } catch(error) {
        return res.sendStatus(500);
    }
}

// DESCRIPTION - Fetchs a specific tweet that the user has clicked on for a focused view.
// route POST /api/tweets/focused_tweet/:id
// @access Private
const fetchTweet = async(req, res) => {
    const { id: tweetToFetchId } = req.params;

    try {
        let tweet = await Post.findById(tweetToFetchId)
        .populate(['postedBy', 'retweetData', 'replyTo'])
        .populate( { path: 'retweetData', populate: { path: 'postedBy', model: 'User'}} )
        .sort({"createdAt": -1 })

        let replies = await Post.find({ replyTo: tweetToFetchId })
        .limit(INITIAL_TWEETS_TO_FETCH)
        .populate(['postedBy', 'retweetData', 'replyTo'])
        .sort({'createdAt': -1})

        return res.status(200).send({tweet, replies});
    } catch(error) {
        console.error("Error fetching single tweet " + req.params.id + " " + error);
        res.sendStatus(500);
    }
}

module.exports = { fetchUserMainFeed, fetchTweet };