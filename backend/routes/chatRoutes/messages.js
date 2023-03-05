const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Message = require('../../schemas/MessageSchema');

router.get('/:chatId', async (req, res) => {
    const reqToken = req.cookies?.token;
    const user = jwt.verify(reqToken, process.env.JWT_SECRET);

    if (!reqToken || !user) {
        res.sendStatus(401);
        return;
    }

    try{
        const message = await Message.find({ chat: req.params.chatId})
        .populate('userSent')
        return res.status(200).send(message);
    } catch(error) {
        console.error("Error fetching message from database " + error);
        return res.sendStatus(500);
    }
})

router.post('/', async (req, res) => {
    const { content, _id } = req.body;
    const reqToken = req.cookies?.token;
    const user = jwt.verify(reqToken, process.env.JWT_SECRET);

    if (!reqToken || !user) {
        res.sendStatus(401);
        return;
    }
    
    if (!content || !_id) {
        res.sendStatus(400);
        return;
    }

    const newMessage = {
        userSent: user._id,
        content: content,
        chat: _id
    }

    try {
        let message = await Message.create(newMessage);
        message = await message.populate(['userSent', 'chat']);
        return res.status(201).send(message);
    } catch(error) {
        console.log('Error creating a new message: ' + error);
        return res.sendStatus(500);
    }
})

module.exports = router;