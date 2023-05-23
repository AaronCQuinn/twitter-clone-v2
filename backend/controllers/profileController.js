const User = require('../models/UserSchema');
const Post = require('../models/PostSchema');

// DESCRIPTION - Fetchs a user's profile.
// route GET /api/profile/:id
// @access Private
const fetchProfile = async(req, res) => {
    const { username } = req.params;
    const user = req.cookies.token;

    if (!user) {
      return res.sendStatus(401);
    }

    // Combine the database queries into a group reducing time to get adata.
    userProfile = await User.findOne({ username: username }, { email: 0, password: 0 })

    let posts = await Post.find({ postedBy: userProfile._id, replyTo: { $exists: false } })
        .populate({
          path: "postedBy", 
          select: '-password -email'
        })
        .populate({
          path: 'retweetData',
          populate: {
            path: 'postedBy',
            select: '-password -email'
          }
        })
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

    if (!user) {
        return res.sendStatus(400);
    };
      
    return res.status(200).send({userProfile, posts});
}

// DESCRIPTION - Fetchs a user's replies to display on their specific profile.
// route GET /api/profile/:id/replies
// @access Private
const fetchProfileReplies = async(req, res) => {
    const { username } = req.params;
    twitterUser = await User.findOne({ username: username }, { email: 0, password: 0 })

    await Post.find({ postedBy: twitterUser._id, replyTo: { $exists: true } })
    .populate({
        path: "postedBy", 
        select: '-password -email'
    })
    .populate({
        path: 'retweetData',
        populate: {
            path: 'postedBy',
            select: '-password -email'
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
    const twitterUser = await User.findOne({ username: username }, { email: 0, password: 0 }).populate('following', '_id firstName lastName username profilePicture description');
    res.status(200).send(twitterUser.following);
}

const fetchProfileFollowers = async(req, res) => {
    const { username } = req.params;
    const twitterUser = await User.findOne({ username: username }, { email: 0, password: 0 }).populate('followers', '_id firstName lastName username profilePicture description');
    res.status(200).send(twitterUser.followers);
}



module.exports = { fetchProfile, fetchProfileReplies, fetchProfileFollowing, fetchProfileFollowers };