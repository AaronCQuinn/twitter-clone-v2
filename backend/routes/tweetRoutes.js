const express = require('express');
const router = express.Router();
const { deleteTweet, pinTweet, postTweet, postReply, likeTweet, retweetTweet } = require('../controllers/tweetController');

router.post('/tweets/post_tweet', postTweet);
router.post('/tweets/post_reply/:id', postReply);
router.post('/tweets/retweet_tweet/:id', retweetTweet);
router.delete('/tweets/delete_tweet/:id', deleteTweet);
router.put('/tweets/pin_tweet/:id', pinTweet);
router.put('/tweets/like_tweet/:id', likeTweet);

module.exports = router;