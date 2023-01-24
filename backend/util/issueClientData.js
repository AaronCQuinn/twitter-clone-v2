function issueClientData(user) {
    const {username, _id, profilePicture, likes, retweets, firstName, lastName, following, followers} = user;

    const clientData = {
        username,
        profilePicture,
        _id,
        likes,
        retweets,
        firstName,
        lastName,
        following,
        followers
    }

    return clientData;
}

module.exports = issueClientData;