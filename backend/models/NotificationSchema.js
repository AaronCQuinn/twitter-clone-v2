const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({

    userTo: {type: Schema.Types.ObjectId, ref: 'User'},
    userFrom: {type: Schema.Types.ObjectId, ref: 'User'},
    notificationType: String,
    opened: { type: Boolean, default: false },

    // Could be many things, intention is to make it link to whatever the notification points to, if a person follows, the entityId is the person, if it's a retweet, directs to the tweet etc.
    entityId: Schema.Types.ObjectId
}, {timestamps: true});


// The "statics" object within a sceme is used for attaching static methods to the schema model itself, rather then individual documents or instances of the model.
NotificationSchema.statics.insertNotification = async(userTo, userFrom, notificationType, entityId) => {
    let data = { userTo, userFrom, notificationType, entityId };

    if (userTo.toString() === userFrom.toString()) {
        return;
    }

    // Check if the notification already exists. If this check didn't exist, a user could just toggle a like on a tweet for example and spam the notification page of other users with no real value.
    await Notification.deleteOne(data).catch(error => console.log(error));

    return Notification.create(data).catch(error => console.log(error));
}

NotificationSchema.statics.NOTIFICATION_TYPES = {
    FOLLOW: "follow",
    RETWEET: 'retweet',
    LIKE: 'like',
    REPLY: 'reply'
}

let Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;