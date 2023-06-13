const User = require('../models/UserSchema');
const Post = require('../models/PostSchema');
const { ObjectId } = require('mongodb');

// DESCRIPTION - Fetchs a user's profile.
// route GET /api/profile/:id
// @access Private
const fetchProfile = async(req, res) => {
    const { username } = req.params;
    const isUserId = ObjectId.isValid(username);
    
    // Combine the database queries into a group reducing time to get adata.
    userProfile = await User.findOne(isUserId ? {_id: username} : {username: username})

    let posts = await Post.find({ postedBy: userProfile._id, replyTo: { $exists: false } })
    .populate('postedBy').populate({path: 'retweetData', populate: {path:'postedBy'}})
        .populate({
          path: 'replyTo.postedBy',
          select: "username"
        })
        .sort({createdAt: '-1'}
    );

    if (posts.length > 0) {
      const pinnedPosition = posts.findIndex(post => post.pinned === true);
      const removedPinned = posts.splice(pinnedPosition, 1);
      posts.unshift(removedPinned[0]);
    }
      
    return res.status(200).send({userProfile, posts});
}

// DESCRIPTION - Fetchs a user's replies to display on their specific profile.
// route GET /api/profile/:id/replies
// @access Private
const fetchProfileReplies = async(req, res) => {
    const { username } = req.params;
    const isUserId = ObjectId.isValid(username);
    twitterUser = await User.findOne(isUserId ? {_id: username} : {username: username})

    await Post.find({ postedBy: twitterUser._id, replyTo: { $exists: true } })
    .populate({
        path: "postedBy", 
    })
    .populate({
        path: 'retweetData',
        populate: {
            path: 'postedBy',
        }
    })
    .populate({
        path: 'replyTo',
    })
    .sort({createdAt: -1})
    .then(async response => {
      response = await User.populate(response, {path: "replyTo.postedBy", select: "username"})
      response = await User.populate(response, {path: "retweetData.postedBy", select: '-password -email'})
      return res.status(200).send({posts: response});
    })
    .catch(error => {
      console.log(error);
    });
}

const fetchProfileFollowing = async(req, res) => {
    const { username } = req.params;
    const isUserId = ObjectId.isValid(username);

    const twitterUser = await User.findOne(isUserId ? {_id: username} : {username: username}).populate('following', '_id firstName lastName username profilePicture description');
    res.status(200).send(twitterUser.following);
}

const fetchProfileFollowers = async(req, res) => {
    const { username } = req.params;
    const isUserId = ObjectId.isValid(username);

    const twitterUser = await User.findOne(isUserId ? {_id: username} : {username: username}).populate('followers', '_id firstName lastName username profilePicture description');
    res.status(200).send(twitterUser.followers);
}



module.exports = { fetchProfile, fetchProfileReplies, fetchProfileFollowing, fetchProfileFollowers };