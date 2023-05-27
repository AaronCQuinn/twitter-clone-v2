const express = require('express');
const router = express.Router();
const { searchForPost, searchForUser } = require('../controllers/searchController');

router.get('/search/users', searchForUser);
router.get('/search/posts', searchForPost);

module.exports = router;