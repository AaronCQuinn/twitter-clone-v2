const express = require('express');
const router = express.Router();
const { fetchSpecificDirectMessage, fetchDirectMessages, createNewDirectMessage, updateDirectMessageName, fetchDirectMessageContents, postNewMessage, markMessagesRead } = require('../controllers/chatController');

router.get('/fetch_dms', fetchDirectMessages);
router.get('/fetch_dm/:chatId', fetchSpecificDirectMessage);
router.post('/create_dm', createNewDirectMessage);
router.put('/update_dm_name/:chatId', updateDirectMessageName);
router.get('/fetch_dm/messages/:chatId', fetchDirectMessageContents);
router.post('/post_message', postNewMessage);
router.put('/mark-messages-read', markMessagesRead);

module.exports = router;