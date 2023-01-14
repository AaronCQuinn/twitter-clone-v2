import React from 'react'
import { useState } from 'react'
import './profilebiotabs.css'
import { useParams } from 'react-router-dom';
import Spinner from '../../Spinner/Spinner';
import Tweet from '../../Tweet/Tweet'

const ProfileBioTabs = ({user, profile}) => {
    const [isSelected, setIsSelected] = useState('posts');
    const [loading, setLoading] = useState(false);
    const [replies, setReplies] = useState();
    const { username } = useParams();

    const getReplies = async(username) => {
        setLoading(true);
        try {
            let res = await fetch(`/api/profile/${username}/replies`);
            let data = await res.json();
            setReplies(data);
            setLoading(false);
        } catch(error) {
            console.log("Error trying to get profile from the database: " + error);
        }
    }

    const handleRepliesClick = (username) => {
        setIsSelected('replies');
        getReplies(username);
    }

    return (
        <>
        <div className="tabsContainer">
            <span className={`tab ${isSelected === 'posts' && 'active'}`} onClick={() => setIsSelected('posts')}>
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
            replies.length === 0 ? <div className='noTweetError'>This user has no replies to show yet!</div>
            :
            replies.map((post) => {
                return <Tweet post={post} key={post._id} user={user} />
            })
        }
        </>
    )
}

export default ProfileBioTabs