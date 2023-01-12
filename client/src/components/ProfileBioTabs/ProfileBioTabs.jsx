import React from 'react'
import { useState, useEffect } from 'react'
import './profilebiotabs.css'
import { useParams } from 'react-router-dom';
import Spinner from '../../components/Spinner/Spinner';
import Tweet from '../../components/Tweet/Tweet'

const ProfileBioTabs = ({user}) => {
    const [isSelected, setIsSelected] = useState('posts');
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState();
    const [replies, setReplies] = useState();
    const { username } = useParams();

    const getProfile = async(username) => {
        setLoading(true);
        try {
            let res = await fetch(`/api/profile/${username}`);
            let data = await res.json();
            setProfile(data.posts);
            setLoading(false);
        } catch(error) {
            console.log("Error trying to get profile from the database: " + error);
        }
    }

    
    const getReplies = async(username) => {
        setLoading(true);
        try {
            let res = await fetch(`/api/profile/${username}/replies`);
            let data = await res.json();
            setReplies(data.posts);
            setLoading(false);
        } catch(error) {
            console.log("Error trying to get profile from the database: " + error);
        }
    }

    const handlePostsClick = (username) => {
        setIsSelected('posts');
        getProfile(username);
    };

    const handleRepliesClick = (username) => {
        setIsSelected('replies');
        getReplies(username);
    }

    useEffect(() => {
        getProfile(username);
    }, [username])

    return (
        <>
        <div className="tabsContainer">
            <span className={`tab ${isSelected === 'posts' && 'active'}`} onClick={() => handlePostsClick(username)}>
                Posts
            </span>
            <span className={`tab ${isSelected === 'replies' && 'active'}`} onClick={() => handleRepliesClick(username)}>
                Replies
            </span>
        </div>

        
        {
            loading ? <Spinner /> 
            :
            isSelected === 'posts' ?
                profile.map((post) => {
                    return <Tweet post={post} key={post._id} user={user} />
                })
            :
            isSelected === 'replies' && 
                replies.map((post) => {
                    return <Tweet post={post} key={post._id} user={user} />
                })
        }
        </>
    )
}

export default ProfileBioTabs