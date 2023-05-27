const express = require('express');
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser');
require('dotenv').config();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json(), cookieParser());

// Routes bundled into this file for organization.
require('./routes/routes_master.js')(app);
require('./socket/socket.js')(app);
require('./database/database.js');

app.listen(process.env.PORT, () => {
    console.log(`Server is now listening on PORT ${process.env.PORT}.`)
});