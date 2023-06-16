const express = require('express');
const router = express.Router();
const { logUserIn, registerUser, logUserOut, verifyUserAuth, toggleFollowUser } = require('../controllers/userController');
const { verifyToken } = require('../middleware/verifyToken');

router.post('/user_login', logUserIn);
router.post('/user_registration', registerUser);
router.get('/user_logout', logUserOut);
router.get('/user_authentication', verifyUserAuth);
router.put('/toggle_follow/:id', verifyToken, toggleFollowUser);

module.exports = router;