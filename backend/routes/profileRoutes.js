const express = require('express');
const router = express.Router();
const { fetchProfile, fetchProfileReplies, fetchProfileFollowing, fetchProfileFollowers, fetchProfileTweets } = require('../controllers/profileController');

router.get('/profile/:profileId', fetchProfile);
router.get('/profile/:profileId/tweets', fetchProfileTweets);
router.get('/profile/:profileId/replies', fetchProfileReplies);
router.get('/profile/:profileId/following', fetchProfileFollowing);
router.get('/profile/:profileId/followers', fetchProfileFollowers);

module.exports = router;