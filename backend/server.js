const express = require('express');
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const database = require('./database');

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
const postApiRoute = require('./routes/post'); // Route for accessing a single post.
app.use('/api/post', postApiRoute);

const server = app.listen(PORT, () => {
    console.log(`Server is now listening on PORT ${PORT}.`)
});