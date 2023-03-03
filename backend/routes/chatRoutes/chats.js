const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Chat = require('../../schemas/ChatSchema');
const User = require('../../schemas/UserSchema');
const { ObjectId } = require('mongodb');

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
    .sort({ updatedAt: -1 })
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

    if (!reqToken || !user || !chatId || chatId === user._id) {
        return res.sendStatus(401);
    }

    try {
        const isValidId = mongoose.isValidObjectId(chatId); // Checks to see if the string passed in is a valid mongoose object.

        if (!isValidId) {
            throw new Error();
        }

        let fetchUser = await User.findById(chatId);

        const filter = {
            isGroupChat: false,
            users: {$size: 2, $all: [ObjectId(user._id), ObjectId(chatId)]}
        } 

        let fetchChat;

        if (fetchUser) {
            // If the ID returns a user, either a DM already exists or one wants to be created.
            fetchChat = await Chat.findOne(filter);

            if (fetchChat) {
                res.status(200).send(fetchChat);
                return;
            }

            fetchChat = await Chat.create({
                isGroupChat: false,
                users: [user._id, chatId]
            })
            .then(response => {
                return Chat.findById(response._id).populate('users');
            })
            .catch(error => {
                console.error(error);
            });
              
              
            res.status(200).send(fetchChat);
            return;
        }

        fetchChat = await Chat.findOne( { _id: chatId, users: { $elemMatch: { $eq: user._id }}} ).populate('users')

        if (!fetchChat) {
            // If this returns false, it means there's no other user or group chat related to the ID passed in a param and nothing can be fetched or created.
            throw new Error();
        }

        res.status(200).send(fetchChat);


    } catch(error) {
        console.log('Error fetching a chat: ' + error);
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