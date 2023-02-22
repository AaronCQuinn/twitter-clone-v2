const express = require('express');
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
require('./database');

const PORT = 5000;
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cookieParser());

// Access Routes
const verifyAuthRoute = require('./routes/accessRoutes/verifyAuth');
app.use('/api/user_authentication', verifyAuthRoute)
const userRegistrationRoute = require('./routes/accessRoutes/userRegistration');
app.use('/api/user_registration', userRegistrationRoute);
const userLoginRoute = require('./routes/accessRoutes/userLogin');
app.use('/api/user_login', userLoginRoute);
const userLogoutRoute = require('./routes/accessRoutes/userLogout');
app.use('/api/user_logout', userLogoutRoute);

// Api Routes
const postsApiRoute = require('./routes/posts');
app.use('/api/posts', postsApiRoute);
const postApiRoute = require('./routes/post');
app.use('/api/post', postApiRoute);
const profileApiRoute = require('./routes/profile.js');
app.use('/api/profile', profileApiRoute);
const followApiRoute = require('./routes/followRoutes/follow.js');
app.use('/api/follow', followApiRoute);
const searchApiRoute = require('./routes/searchRoutes/search');
app.use('/api/search', searchApiRoute);

// Upload Routes
const uploadRoute = require('./routes/uploadRoutes/uploadRoutes');
const { search } = require('./routes/posts');
app.use('/api/uploads', uploadRoute);

app.listen(PORT, () => {
    console.log(`Server is now listening on PORT ${PORT}.`)
});