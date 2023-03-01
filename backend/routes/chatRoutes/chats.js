const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
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
        const isValidId = mongoose.isValidObjectId(chatId);

        if (!isValidId) {
            throw new Error();
        }

        let chat = await Chat.findOne( { _id: chatId, users: { $elemMatch: { $eq: user._id }}} )
        .populate('users')

        if (!chat) {
            let userFound = await User.findById(chatId);
    
            if (!userFound) {
                throw new Error();
            }
        }
    
        chat = await getChatByUserId(user._id, chatId);

        res.status(200).send(chat);

    } catch(error) {
        return res.sendStatus(401);
    }
})

function getChatByUserId(userLoggedIn, otherUser) {
    return Chat.findOneAndUpdate({
        // This bit acts as a filter, the chat must be a 1 on 1 between two users.
        // It must only include two of the users being the one queried, and the one logged in.
        isGroupChat: false,
        users: {
            $size: 2,
            $all: [
                {   
                    $elemMatch: { $eq: mongoose.Types.ObjectId(userLoggedIn) }, 
                    $elemMatch: { $eq: mongoose.Types.ObjectId(otherUser) }
                }
            ]}
        },
        // If we're inserting a document, place an array with that information.
        {
            $setOnInsert: {
                users: [userLoggedIn, otherUser]
            }
        },


        {
            new: true, // Return the newly created document back after creation.
            upsert: true, // If we didn't find an object matching, create it.
        }
    )
    .populate('users');
}


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