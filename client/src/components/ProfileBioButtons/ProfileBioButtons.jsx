import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './profilebiobuttons.css'
import FollowButton from '../FollowButton/FollowButton';
import { AuthContext } from '../../context/AuthContext';

const ProfileBioButtons = ({ profileData }) => {
    const { state } = useContext(AuthContext);
    const { username } = profileData;

    return (
        <div className="profileButtonsContainer">
            {profileData.username.toLowerCase() === state.user.username.toLowerCase() ?
                <button className='editButton'>
                    Edit Profile
                </button>
                :
                <>
                <Link to={`/messages/${username}`} className='messageButton' >
                    <FontAwesomeIcon icon={faEnvelope} />
                </Link>
                <FollowButton id={profileData._id} />
                </>
            }

        </div>
    )
}

export default ProfileBioButtons