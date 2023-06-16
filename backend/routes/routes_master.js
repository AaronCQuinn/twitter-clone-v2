const userRoutes = require('./userRoutes');
const tweetRoutes = require('./tweetRoutes');
const feedRoutes = require('./feedRoutes');
const imageRoutes = require('./imageRoutes');
const profileRoutes = require('./profileRoutes');
const searchRoutes = require('./searchRoutes');
const chatRoutes = require('./chatRoutes');
const notificationRoutes = require('./notificationRoutes');
const { verifyToken } = require('../middleware/verifyToken');

BASE_API_URL = '/api';

module.exports = (app) => {
    app.use(BASE_API_URL, userRoutes);
    app.use(BASE_API_URL, verifyToken, tweetRoutes);
    app.use(BASE_API_URL, verifyToken, feedRoutes);
    app.use(BASE_API_URL, verifyToken, imageRoutes);
    app.use(BASE_API_URL, profileRoutes);
    app.use(BASE_API_URL, searchRoutes);
    app.use(BASE_API_URL + '/chats', verifyToken, chatRoutes);
    app.use(BASE_API_URL + '/notifications', verifyToken, notificationRoutes);
}