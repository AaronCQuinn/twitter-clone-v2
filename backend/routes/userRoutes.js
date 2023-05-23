const express = require('express');
const router = express.Router();
const { logUserIn, registerUser, logUserOut, verifyUserAuth } = require('../controllers/userController');

router.post('/user_login', logUserIn);
router.post('/user_registration', registerUser);
router.get('/user_logout', logUserOut);
router.get('/user_authentication', verifyUserAuth);

module.exports = router;