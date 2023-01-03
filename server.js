const express = require('express');
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const database = require('./backend/database');

const PORT = 5000;
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cookieParser());

// Access Routes
const verifyAuthRoute = require('./backend/routes/accessRoutes/verifyAuth');
app.use('/api/user_authentication', verifyAuthRoute)
const userRegistrationRoute = require('./backend/routes/accessRoutes/userRegistration');
app.use('/api/user_registration', userRegistrationRoute);
const userLoginRoute = require('./backend/routes/accessRoutes/userLogin');
app.use('/api/user_login', userLoginRoute);
const userLogoutRoute = require('./backend/routes/accessRoutes/userLogout');
app.use('/api/user_logout', userLogoutRoute);

// Api Routes
const postsApiRoute = require('./backend/routes/posts');
app.use('/api/posts', postsApiRoute);

const server = app.listen(PORT, () => {
    console.log(`Server is now listening on PORT ${PORT}.`)
});