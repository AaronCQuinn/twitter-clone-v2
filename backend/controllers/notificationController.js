const Notification = require("../models/NotificationSchema");

const fetchNotifications = async(req, res) => {
    const { _id: LoggedInUserId } = req.cookies.decodedToken;

    try {
        const userNotifications = await Notification.find( { userTo: LoggedInUserId, notificationType: { $ne: Notification.NOTIFICATION_TYPES.MESSAGE } }).populate(['userTo', 'userFrom']).sort({ createdAt: -1 });
        return res.status(200).send(userNotifications);
    } catch(error) {
        res.sendStatus(500);
    }


}

module.exports = { fetchNotifications };