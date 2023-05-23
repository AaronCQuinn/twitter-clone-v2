const express = require('express');
const router = express.Router();
const { fetchUserMainFeed, fetchTweet } = require('../controllers/feedController');

router.get('/feed/main_feed', fetchUserMainFeed);
router.get('/feed/focused_tweet/:id', fetchTweet);

module.exports = router;