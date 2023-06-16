const User = require('../models/UserSchema');
const Post = require('../models/PostSchema');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

// DESCRIPTION - Fetchs a user's profile.
// route GET /api/profile/:id
// @access Private
const fetchProfile = async(req, res) => {
    const { profileId } = req.params;
    let { _id: LoggedInUser } = req.cookies.decodedToken;
    
    try {
        const userProfile = await User.aggregate([
            {
              $match: { _id: mongoose.Types.ObjectId(profileId) }
            },
            {
              $project: {
                username: 1,
                firstName: 1,
                lastName: 1,
                profilePicture: 1,
                coverPhoto: 1,
                followersCount: { $size: '$followers' },
                followingCount: { $size: '$following' },
                followingRequestingUser: {
                  $cond: {
                    if: { $in: [mongoose.Types.ObjectId(LoggedInUser), '$following'] },
                    then: true,
                    else: false
                  }
                },
                doesRequestingUserFollow: {
                  $cond: {
                    if: { $in: [mongoose.Types.ObjectId(LoggedInUser), '$followers'] },
                    then: true,
                    else: false
                  }
                }
              }
            }
          ]);
        if (!userProfile) {
            return res.sendStatus(400);
        }

        return res.status(200).send(userProfile[0]);
    } catch(error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

const fetchProfileTweets = async(req, res) => {
    const { profileId } = req.params;

    let posts = await Post.find({ postedBy: profileId, replyTo: { $exists: false } })
    .populate('postedBy')
    .populate({ path: 'retweetData', populate: { path: 'postedBy' } })
    .populate({ path: 'replyTo.postedBy', select: "username" })
    .sort({ createdAt: '-1' });

    if (posts.length > 0) {
      const pinnedPosition = posts.findIndex(post => post.pinned === true);
      const removedPinned = posts.splice(pinnedPosition, 1);
      posts.unshift(removedPinned[0]);
    }
      
    return res.status(200).send(posts);
}

// DESCRIPTION - Fetchs a user's replies to display on their specific profile.
// route GET /api/profile/:id/replies
// @access Private
const fetchProfileReplies = async(req, res) => {
    const { profileId } = req.params;
    const isUserId = ObjectId.isValid(profileId);

    if (!isUserId) {
      return res.sendStatus(400);
    }

    try {
      let profileReplies = await Post.find({ postedBy: mongoose.Types.ObjectId(profileId), replyTo: { $exists: true } })
      .populate(["postedBy", "replyTo", {path: 'retweetData', populate: {path: 'postedBy'}}])
      .sort({createdAt: -1})

      await User.populate(profileReplies, [{path: "replyTo.postedBy", select: "username"}, {path: "retweetData.postedBy"}]);

      return res.status(200).send(profileReplies);
    } catch(error) {
      console.log(error);
      return res.sendStatus(500);
    }
}

const fetchProfileFollowing = async(req, res) => {
    const { profileId } = req.params;
    const isUserId = ObjectId.isValid(profileId);

    if (!isUserId) {
      return res.sendStatus(400);
    }

    try {
      const profileFollowing = await User.findById(profileId).populate('following').limit(20);
      
      return res.status(200).send(profileFollowing);
    } catch(error) {
      return res.sendStatus(500);
    }
}

const fetchProfileFollowers = async(req, res) => {
    const { profileId } = req.params;
    const isUserId = ObjectId.isValid(profileId);
    const { _id: LoggedInUser } = req.cookies.decodedToken;

    if (!isUserId) {
      return res.sendStatus(400);
    }

    // Need the users the profile being accessed is followed by.
    let profileFollowers = await User.findById(profileId).limit(20).select('following').populate('following');

    // Extract an array of those followers ids to compare.
    const profileFollowersIds = profileFollowers.following.map(follower => follower._id);

    const mutualIds = await User.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(LoggedInUser)
        }
      },
      {
        $project: {
          _id: 0,
          isMutual: {
            $map: {
              input: profileFollowersIds,
              as: 'followerId',
              in: {
                $cond: {
                  if: { $in: ['$$followerId', '$following'] },
                  then: true,
                  else: false
                }
              }
            }
          }
        }
      }
    ]);

    // const matches = profileFollowersFollowers.map(follower => {
    //   followers
    //   return {
    //     follower,
    //     isFollowing: loggedInUserFollowingIds.includes(follower)
    //   }
    // })

    // console.log(matches);
    // console.log('Requested users followers ids:', profileFollowersIds);
    // console.log('Logged in users following ids:', loggedInUserFollowingIds);


    res.status(200).send(profileFollowers);
}



module.exports = { fetchProfile, fetchProfileTweets, fetchProfileReplies, fetchProfileFollowing, fetchProfileFollowers };