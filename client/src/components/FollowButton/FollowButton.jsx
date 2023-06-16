import axios from 'axios';
import React, { useContext } from 'react'
import { showToast } from '../Toast/showToast';
import { AuthContext } from '../../context/AuthContext';
import { SocketContext } from '../../context/SocketContext';
import { ProfileContext } from '../../context/ProfileContext';

const FollowButton = ({ styles, doesRequestingUserFollow, idToFollow }) => {
    const { emitNotification } = useContext(SocketContext);
    

    const handleClick = async (id) => {
        try {
            await axios.put(`/api/toggle_follow/${id}`, {id}, { headers: {'Content-Type': 'application/json'}});
            emitNotification(id);
            // updateProfileFollowingCount();
        } catch (error) {
            showToast('There was an error following this user, please try again!', 'error');
            console.log(`Error posting to back end: ${error}`);
        }
    }
   
    return (    
        <button className={`${doesRequestingUserFollow && 'following'} ${styles}`} onClick={() => handleClick(idToFollow)}>
            {doesRequestingUserFollow ? 'Following' : 'Follow'}
        </button>
    )
}

export default FollowButton