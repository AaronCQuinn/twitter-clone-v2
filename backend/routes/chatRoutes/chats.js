const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Chat = require('../../schemas/ChatSchema');
const User = require('../../schemas/UserSchema')

router.get('/', (req, res) => {
    const reqToken = req.cookies?.token;
    if (!reqToken) {
        return res.sendStatus(401);
    }

    const user = jwt.verify(reqToken, process.env.JWT_SECRET);

    if (!user) {
        return res.statusMessage(401);
    }

    // Search the chat table, all the property of the chat schema called users, where the element (elemMatch) has a value equal (eq) to the logged in user's ID.
    Chat.find({ users: { $elemMatch: { $eq: user._id }}})
    .populate('users')
    .sort({ createdAt: -1 })
    .limit(10) 
    .then(results => 
        res.status(200).send(results)
    )
    .catch(error => {
        console.error(error);
        res.sendStatus(400);
    })
})

router.get('/:chatId', async (req, res) => {
    const { chatId } = req.params;
    const reqToken = req.cookies?.token;
    const user = jwt.verify(reqToken, process.env.JWT_SECRET);
    
    if (!reqToken || !user || !chatId ) {
        return res.sendStatus(401);
    }

    try {
        const chat = await Chat.findOne( { _id: chatId, users: { $elemMatch: { $eq: user._id }}} )
        .populate('users')

        if (!chat) {
            let userFound = await User.findById(chatId);
    
            if (!userFound) {
                throw new Error();
            }
        }

        res.status(200).send(chat);

    } catch(error) {
        return res.sendStatus(401);
    }
})


router.post('/', (req, res) => {
    const { selectedUsers } = req.body;

    const reqToken = req.cookies?.token;
    if (!reqToken) {
        return res.sendStatus(401);
    }

    const user = jwt.verify(reqToken, process.env.JWT_SECRET);

    if (!user) {
        return res.statusMessage(401);
    }

    if (!selectedUsers || selectedUsers.length === 0) {
        console.log('User tried to create a chat with no user property.');
        return res.sendStatus(400);
    }

    selectedUsers.push(user);

    const chatData = {
        users: selectedUsers,
        isGroupChat: true,
    }

    try {
        Chat.create(chatData)
        .then(results => res.status(200).send(results))
    } catch(error) {
        return res.sendStatus(500);
    }
})  

module.exports = router;