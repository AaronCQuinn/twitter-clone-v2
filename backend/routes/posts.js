const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const Post = require('../schemas/PostSchema');
const User = require('../schemas/UserSchema');

router.get('/', (req, res) => {

})

router.post('/', async(req, res) => {
    const user = req.cookies.token;
    const {username, _id} = jwt.decode(user);

    if (!req.body.content) {
        console.log('User ' + username + ' attempted to submit a tweet without any content.')
        return res.sendStatus(400);
    }

    let { content } = req.body;

    const postData = {
        content: content.trim(),
        postedBy: _id
    }

    Post.create(postData)
    .then(async response => {
        response = await User.populate(response, {path: "postedBy"})
        return res.status(201).send(response);
    })
    .catch(error => {
        console.log('User ' + username + 'encountered an error trying to write their post to Mongo: ' + error);
        return res.sendStatus(500);
    });
})

module.exports = router;