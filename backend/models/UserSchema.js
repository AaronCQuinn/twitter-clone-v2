const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: { 
        type: String, 
        required: true, 
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String, 
        required: true,
        unique: true
    },
    email: { 
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String, 
        default: "/api/images/profilePicture.png"
    },
    coverPhoto: {
        type: String, 
        default: "/api/images/default_cover_photo.jpg"
    },
    likes: [{type: Schema.Types.ObjectId, ref: "Post" }],
    retweets: [{type: Schema.Types.ObjectId, ref: "Post" }],
    following: [{type: Schema.Types.ObjectId, ref: "User" }],
    followers: [{type: Schema.Types.ObjectId, ref: "User" }],
}, {timeStamps: true});

UserSchema.set('toJSON', {
    transform: function(doc, ret) {
        delete ret.password;
        delete ret.email;
        return ret;
    }
})

let User = mongoose.model('User', UserSchema);
module.exports = User;