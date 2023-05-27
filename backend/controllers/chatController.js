const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Chat = require('../models/ChatSchema');
const User = require('../models/UserSchema');
const Message = require('../models/MessageSchema');
const { ObjectId } = require('mongodb');

const NUMBER_OF_DMS_TO_FETCH = 10;
// DESCRIPTION - Fetchs a set amount of the most recent DMs a user is a part of.
// route GET /api/chats/fetch_dms
// @access Private
const fetchDirectMessages = async(req, res) => {
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
    .limit(NUMBER_OF_DMS_TO_FETCH) 
    .then(results => 
        res.status(200).send(results)
    )
    .catch(error => {
        console.error(error);
        res.sendStatus(400);
    })
}

// DESCRIPTION - Fetchs a specific DM that the user is trying to interact with, if it doesn't exist it is created.
// route GET /api/chats/fetch_dm/:chatId
// @access Private
const fetchSpecificDirectMessage = async(req, res) => {
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
}

// DESCRIPTION - Creates a new DM.
// route GET /api/chats/create_dm
// @access Private
const createNewDirectMessage = async(req, res) => {
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
}

// DESCRIPTION - Updates the specific name of DM.
// route GET /api/chats/update_dm_name/:chatId
// @access Private
const updateDirectMessageName = async(req, res) => {
    const { chatName } = req.body;
    const reqToken = req.cookies?.token;
    const user = jwt.verify(reqToken, process.env.JWT_SECRET);
        
    if (!chatName || !reqToken || !user) {
        res.sendStatus(401);
        return;
    }
    
    try {
        const response = await Chat.findOneAndUpdate({_id: req.params.chatId}, {chatName: req.body.chatName.trim() }, {new: true} )
        res.status(201).send(response);
        return;
    } catch(error) {
        res.sendStatus(500);
    }
}

// DESCRIPTION - Fetches all the messages in a certain DM.
// route GET /api/chats/fetch_dm/messages/:chatId
// @access Private
const fetchDirectMessageContents = async(req, res) => {
    const reqToken = req.cookies?.token;
    const user = jwt.verify(reqToken, process.env.JWT_SECRET);

    if (!reqToken || !user) {
        res.sendStatus(401);
        return;
    }

    try{
        const message = await Message.find({ chat: req.params.chatId })
        .populate('userSent')
        return res.status(200).send(message);
    } catch(error) {
        console.error("Error fetching message from database " + error);
        return res.sendStatus(500);
    }
}

// DESCRIPTION - Post a new message to a DM.
// route GET /api/chats/post_message
// @access Private
const postNewMessage = async(req, res) => {
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
}

module.exports = { fetchDirectMessages, fetchSpecificDirectMessage, createNewDirectMessage, updateDirectMessageName, fetchDirectMessageContents, postNewMessage };
