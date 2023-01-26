function issueClientData(user) {
    const {username, _id, profilePicture, likes, retweets, firstName, lastName, following, followers, coverPhoto} = user;

    const clientData = {
        username,
        profilePicture,
        _id,
        likes,
        retweets,
        firstName,
        lastName,
        following,
        followers,
        coverPhoto
    }

    return clientData;
}

module.exports = issueClientData;