const userRoutes = require('./routes/userRoutes');
const tweetRoutes = require('./routes/tweetRoutes');
const feedRoutes = require('./routes/feedRoutes');
const imageRoutes = require('./routes/imageRoutes');
const profileRoutes = require('./routes/profileRoutes');
const searchRoutes = require('./routes/searchRoutes');
const chatRoutes = require('./routes/chatRoutes');

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