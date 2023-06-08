const express = require('express');
const router = express.Router();
const { fetchNotifications } = require('../controllers/notificationController.js');

router.get('/get_notifications', fetchNotifications);

module.exports = router;