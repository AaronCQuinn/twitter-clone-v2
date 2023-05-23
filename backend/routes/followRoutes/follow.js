const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../../models/UserSchema')

router.put('/:id', async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.sendStatus(400);
    }

    const reqToken = req.cookies?.token;
    if (!reqToken) {
        return res.sendStatus(401);
    }

    const user = jwt.verify(reqToken, process.env.JWT_SECRET);

    if (!user) {
        return res.statusMessage(401);
    }


    const isFollowed = user.following && user.following.includes(id);

    const returnUser = await User.findByIdAndUpdate(user._id, { [isFollowed ? "$pull" : "$addToSet"]: {following: id} }, { new: true })
    .catch(error => {
        console.error('User ' + user.username + " encountered an error while following a user: " + error)
        res.sendStatus(500);
    })


    await User.findByIdAndUpdate(id, { [isFollowed ? "$pull" : "$addToSet"]: {followers: user._id} }, { new: true })
    .catch(error => {
        console.error('Encountered an error trying to add a follower to user:' + error)
        res.sendStatus(500);
    })


    const {username, profilePicture, _id, likes, retweets, following, followers} = returnUser;
    const clientData = {
        username, 
        profilePicture, 
        _id, 
        likes,
        retweets,
        followers,
        following
    }

    // Reissue the JWT with the new info.
    const token = jwt.sign(clientData, process.env.JWT_SECRET);
    res.cookie("token", token, {
            httpOnly: true
        }
    )

    return res.status(201).send(returnUser);
});

module.exports = router;