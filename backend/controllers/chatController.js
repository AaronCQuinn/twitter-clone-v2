const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Chat = require('../models/ChatSchema');
const User = require('../models/UserSchema');
const Message = require('../models/MessageSchema');
const Notification = require('../models/NotificationSchema');
const { ObjectId } = require('mongodb');

const NUMBER_OF_DMS_TO_FETCH = 10;
// DESCRIPTION - Fetchs a set amount of the most recent DMs a user is a part of.
// route GET /api/chats/fetch_dms
// @access Private
const fetchDirectMessages = async(req, res) => {
    const { _id: loggedInUser } = req.cookies.decodedToken;
    try {
    // Search the chat table, all the property of the chat schema called users, where the element (elemMatch) has a value equal (eq) to the logged in user's ID.
    const fetchChats = await Chat.find({ users: { $elemMatch: { $eq: loggedInUser }}})
    .limit(NUMBER_OF_DMS_TO_FETCH) 
    .populate(['users', 'latestMessage'])
    .sort({ updatedAt: -1 })

    return res.status(200).send(fetchChats);

    } catch(error) {
        res.sendStatus(400);
    }
}

// DESCRIPTION - Fetchs a specific DM that the user is trying to interact with, if it doesn't exist it is created.
// route GET /api/chats/fetch_dm/:chatId
// @access Private
const fetchSpecificDirectMessage = async(req, res) => {
    const { chatId } = req.params;
    const { _id: loggedInUser } = req.cookies.decodedToken;

    if (!chatId || chatId === loggedInUser) {
        return res.sendStatus(401);
    }

    try {
        const isValidId = mongoose.isValidObjectId(chatId); // Checks to see if the string passed in is a valid mongoose object.

        if (!isValidId) {
            throw new Error();
        }

        let fetchChat;
        fetchChat = await Chat.findById(chatId).populate('users');

        if (fetchChat) {
            return res.status(200).send(fetchChat);
        }

        /* If a chat with the ID doesn't exist, we must check to see if it's another users ID that is passed in from viewing another persons profile.
        in that case, we can check to see if a DM between the logged in user and the requested user already exists. If not, create the DM. */
        const filter = {
            isGroupChat: false,
            users: {$size: 2, $all: [ObjectId(loggedInUser), ObjectId(chatId)]}
        } 
        fetchChat = await Chat.findOne(filter).populate('users');

        if (fetchChat) {
            return res.status(200).send(fetchChat);
        }

        fetchChat = await Chat.create({
            isGroupChat: false,
            users: [loggedInUser, chatId]
        }).populate('users')
      
        return res.status(200).send(fetchChat);
        // fetchChat = await Chat.findOne( { _id: chatId, users: { $elemMatch: { $eq: user._id }}} ).populate('users').select('-email -password')
    } catch(error) {
        console.log('Error fetching a chat: ' + error);
        return res.sendStatus(500);
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
        .populate(['userSent', 'chat'])
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
    const { content: messageContent, _id: chatId } = req.body;
    const { _id: loggedInUser }= req.cookies.decodedToken;
    
    if (!messageContent || !chatId) {
        return res.sendStatus(400);
    }

    const newMessage = {
        userSent: loggedInUser,
        content: messageContent,
        chat: chatId
    }

    try {
        let message = await Message.create(newMessage);
        message = await message.populate(['userSent', 'chat']);
        message = await User.populate(message, { path: 'chat.users'});

        const chatToSendNotifications = await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
        chatToSendNotifications.users.forEach(userId => {
            if (userId.toString() === loggedInUser.toString()) { return };
            
            Notification.insertNotification(userId, loggedInUser, Notification.NOTIFICATION_TYPES.MESSAGE, message.chat._id)
        })

        return res.status(201).send(message);
    } catch(error) {
        console.log('Error creating a new message: ' + error);
        return res.sendStatus(500);
    }
}

const markMessagesRead = async(req, res) => {
    const { body: messagesToUpdate } = req;
    const { _id: loggedInUserId } = req.cookies.decodedToken;

    if (!messagesToUpdate) {
        return res.sendStatus(400);
    }

    try {
        await Message.updateMany(
            { _id: { $in: messagesToUpdate } }, 
            { $addToSet : { readBy: loggedInUserId } },
        );
        return res.sendStatus(200);
    } catch(error) {
        return res.sendStatus(500);
    }
}

module.exports = { fetchDirectMessages, fetchSpecificDirectMessage, createNewDirectMessage, updateDirectMessageName, fetchDirectMessageContents, postNewMessage, markMessagesRead };
