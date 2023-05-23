const express = require('express');
const router = express.Router();
const { fetchProfile, fetchProfileReplies, fetchProfileFollowing, fetchProfileFollowers } = require('../controllers/profileController');

router.get('/profile/:username', fetchProfile);
router.get('/profile/:username/replies', fetchProfileReplies);
router.get('/profile/:username/following', fetchProfileFollowing);
router.get('/profile/:username/followers', fetchProfileFollowers);

module.exports = router;