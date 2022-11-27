const express = require('express');
const app = express();
const PORT = 5000;
const middleware = require('./middleware');
const cors = require("cors");

app.use(cors({
    origin: 'http://localhost:3000'
}));

const server = app.listen(PORT, () => {
    console.log(`Server is now listening on PORT ${PORT}.`)
});

app.get('/api/user_authentication', (req, res) => {
    res.send("Hit the auth API");
})