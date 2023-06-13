const Notification = require("../models/NotificationSchema");
const mongoose = require('mongoose');

// DESCRIPTION - Fetchs the users notifications.
// @access Private
const fetchNotifications = async(req, res) => {
    const { _id: LoggedInUserId } = req.cookies.decodedToken;

    try {
        const userNotifications = await Notification.find({ userTo: LoggedInUserId }).populate(['userTo', 'userFrom']).sort({ createdAt: -1 });
        return res.status(200).send(userNotifications);
    } catch(error) {
        res.sendStatus(500);
    }
}

// DESCRIPTION - Marks all the currently rendered notifications 'opened' property as true.
// @access Private
const markAllNotificationsOpen = async(req, res) => {
    const { _id: LoggedInUserId } = req.cookies.decodedToken;
    const { body: notificationIdArray } = req;

    console.log(notificationIdArray);

    if (!notificationIdArray) {
        return res.sendStatus(400);
    }

    try {
        await Notification.where({userTo: mongoose.Types.ObjectId(LoggedInUserId)})
        .updateMany({_id: { $in: notificationIdArray }}, {opened: true})
        res.sendStatus(200);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
}

// DESCRIPTION - Marks a specific notification's 'opened' property as true.
// @access Private
const markNotificationOpen = async(req, res) => {
    const { _id: LoggedInUserId } = req.cookies.decodedToken;
    const { notificationId } = req.body;

    try {
        await Notification.where({userTo: mongoose.Types.ObjectId(LoggedInUserId)})
        .updateOne({_id: notificationId}, {opened: true})
    } catch(error) {
        res.sendStatus(500);
    }
}

const markAllChatNotificationsOpen = async(req, res) => {
    const { _id: LoggedInUserId } = req.cookies.decodedToken;
    const { body: notificationId } = req;

    if (!notificationId) {
        return res.sendStatus(400);
    }

    try {
        await Notification.where({userTo: mongoose.Types.ObjectId(LoggedInUserId)})
        .updateMany({entityId: notificationId }, {opened: true})
        res.sendStatus(200);
    } catch(error) {
        res.sendStatus(500);
    }
}

module.exports = { fetchNotifications, markAllNotificationsOpen, markNotificationOpen, markAllChatNotificationsOpen };