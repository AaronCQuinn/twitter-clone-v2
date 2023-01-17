import React, { createContext, useState } from 'react';

const ProfileContext = createContext();

function ProfileContextProvider({ children }) {
    const [userProfile, setUserProfile] = useState();
    const [userProfilePosts, setUserProfilePosts] = useState();
    const [loading, setLoading] = useState(true);

    const getProfile = async(username) => {
        setLoading(true);
        try {
            let res = await fetch(`/api/profile/${username}`);
            let data = await res.json();
            setUserProfile(data.userProfile);
            setUserProfilePosts(data.posts);
        } catch(error) {
            console.log("Error trying to get profile from the database: " + error);
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <ProfileContext.Provider value={{ userProfile, userProfilePosts, loading, getProfile }}>
        {children}
        </ProfileContext.Provider>
    );
}

export { ProfileContext, ProfileContextProvider };
