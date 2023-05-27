const { createSocketConnection } = require('./socket.js');
const http = require('http');
const express = require('express');
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser');
require('./database');

const PORT = 5000;
app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.json());
app.use(cookieParser());

// Routes bundled into this file for organization.
require('./routes.js')(app);

const server = http.createServer(app);
const io = createSocketConnection(server);

server.listen(PORT, () => {
    console.log(`Server is now listening on PORT ${PORT}.`)
});