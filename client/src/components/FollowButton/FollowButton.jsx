import axios from 'axios';
import React, { useContext } from 'react'
import { showToast } from '../Toast/showToast';
import { AuthContext } from '../../context/AuthContext';

const FollowButton = ({ user, styles }) => {
    const { loggedInUser } = useContext(AuthContext);
    const handleClick = async (id) => {
        try {
            await axios.put(`/api/toggle_follow/${id}`, {id}, {
              headers: {
                'Content-Type': 'application/json',
              },
            });
        } catch (error) {
            showToast('There was an error following this user, please try again!', 'error');
            console.log(`Error posting to back end: ${error}`);
        }
    }
   
    return (
    user !== loggedInUser._id &&    
    <button 
    className={`${loggedInUser.following.includes(user) && 'following'} ${styles}`}
    onClick={() => handleClick(user)}
    >
        {loggedInUser.following.includes(user) ? 'Following'
        :
        'Follow'
        }
    </button>
    )
}

export default FollowButton