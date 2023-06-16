const express = require('express');
const router = express.Router();
const { fetchNotifications, markAllNotificationsOpen, markNotificationOpen, markAllChatNotificationsOpen, fetchLatestNotification } = require('../controllers/notificationController.js');

router.get('', fetchNotifications);
router.get('/latest', fetchLatestNotification);
router.put('/mark-all-open', markAllNotificationsOpen);
router.put('/mark-open', markNotificationOpen);
router.put('/mark-all-chat-open', markAllChatNotificationsOpen)

module.exports = router;