import React, { createContext, useState } from 'react';
import axios from 'axios';

const ProfileContext = createContext();

function ProfileContextProvider({ children }) {
    const [profile, setProfile] = useState();
    const [profileTweets, setProfileTweets] = useState({});
    const [profileReplies, setProfileReplies] = useState({});
    const [profileFollowing, setProfileFollowing] = useState({});
    const [profileFollowers, setProfileFollowers] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (profileId) => {
        setLoading(true);
        try {
          const [profileResponse, tweetsResponse, repliesResponse, followingResponse, followersResponse] = await Promise.all([
            axios.get(`/api/profile/${profileId}`),
            axios.get(`/api/profile/${profileId}/tweets`),
            axios.get(`/api/profile/${profileId}/replies`),
            axios.get(`/api/profile/${profileId}/following`),
            axios.get(`/api/profile/${profileId}/followers`),
          ]);
          
          setProfile(profileResponse.data);
          setProfileTweets(tweetsResponse.data);
          setProfileReplies(repliesResponse.data);
          setProfileFollowing(followingResponse.data);
          setProfileFollowers(followersResponse.data);
        } catch (error) {
          console.log("Error trying to get profile from the database: " + error);
        } finally {
          setLoading(false);
        }
      };      

    const updateProfileFollowingCount = () =>{
        console.log(profile);
    }

    return (
        <ProfileContext.Provider 
        value={{ 
            profile, 
            profileTweets, 
            profileReplies, 
            profileFollowers,
            profileFollowing,
            loading, 
            fetchProfile,
            updateProfileFollowingCount,
            }}>
        {children}
        </ProfileContext.Provider>
    );
}

export { ProfileContext, ProfileContextProvider };
