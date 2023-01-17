import axios from 'axios';
import React, { useContext } from 'react'
import { showToast } from '../Toast/showToast';
import { AuthContext } from '../../context/AuthContext';

const FollowButton = ({ id }) => {
    const { state } = useContext(AuthContext);
    const handleClick = async (id) => {
        try {
            await axios.put(`/api/follow/${id}`, {id}, {
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
    <button className={`${state.user.following.includes(id) && 'following'} followButton`}  onClick={() => handleClick(id)}>
        {state.user.following.includes(id) ? 'Following'
        :
        'Follow'
        }
    </button>
    )
}

export default FollowButton