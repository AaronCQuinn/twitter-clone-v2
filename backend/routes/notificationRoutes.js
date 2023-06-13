const express = require('express');
const router = express.Router();
const { fetchNotifications, markAllNotificationsOpen, markNotificationOpen, markAllChatNotificationsOpen } = require('../controllers/notificationController.js');

router.get('', fetchNotifications);
router.put('/mark-all-open', markAllNotificationsOpen);
router.put('/mark-open', markNotificationOpen);
router.put('/mark-all-chat-open', markAllChatNotificationsOpen)

module.exports = router;