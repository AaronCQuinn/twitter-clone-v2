import React, { createContext, useState } from 'react';

const ProfileContext = createContext();

function ProfileContextProvider({ children }) {
    const [userProfile, setUserProfile] = useState();
    const [userProfilePosts, setUserProfilePosts] = useState();
    const [userProfileReplies, setUserProfileReplies] = useState();
    const [userProfileFollowing, setUserProfileFollowing] = useState();
    const [userProfileFollowers, setUserProfileFollowers] = useState();
    const [loading, setLoading] = useState(true);

    const getProfile = async(username) => {
        setLoading(true);
        try {
            const [res, replies, following, followers] = await Promise.all([
                fetch(`/api/profile/${username}`),
                fetch(`/api/profile/${username}/replies`),
                fetch(`/api/profile/${username}/following`),
                fetch(`/api/profile/${username}/followers`)
            ]);
            const data = await res.json();
            const repliesData = await replies.json();
            const followingData = await following.json();
            const followersData = await followers.json();
            setUserProfileFollowing(followingData);
            setUserProfileFollowers(followersData);
            setUserProfile(data.userProfile);
            setUserProfilePosts(data.posts);
            setUserProfileReplies(repliesData.posts);
        } catch(error) {
            console.log("Error trying to get profile from the database: " + error);
        } finally {
            setLoading(false);
        }
    }
    
    
    return (
        <ProfileContext.Provider 
        value={{ 
            userProfile, 
            userProfilePosts, 
            userProfileReplies, 
            userProfileFollowers,
            userProfileFollowing,
            loading, 
            getProfile
            }}>
        {children}
        </ProfileContext.Provider>
    );
}

export { ProfileContext, ProfileContextProvider };
