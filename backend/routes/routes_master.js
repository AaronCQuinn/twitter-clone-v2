const userRoutes = require('./userRoutes');
const tweetRoutes = require('./tweetRoutes');
const feedRoutes = require('./feedRoutes');
const imageRoutes = require('./imageRoutes');
const profileRoutes = require('./profileRoutes');
const searchRoutes = require('./searchRoutes');
const chatRoutes = require('./chatRoutes');

BASE_API_URL = '/api';

module.exports = (app) => {
    app.use(BASE_API_URL, userRoutes);
    app.use(BASE_API_URL, tweetRoutes);
    app.use(BASE_API_URL, feedRoutes);
    app.use(BASE_API_URL, imageRoutes);
    app.use(BASE_API_URL, profileRoutes);
    app.use(BASE_API_URL, searchRoutes);
    app.use(BASE_API_URL + '/chats', chatRoutes);
}