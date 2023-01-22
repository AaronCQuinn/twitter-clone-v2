import React, {useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faCamera } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from '../../../context/AuthContext';
import { ProfileContext } from '../../../context/ProfileContext';
import FollowButton from '../../FollowButton/FollowButton';
import './profileheader.css'
import UploadProfilePicModal from '../../Modals/UploadProfilePicModal/UploadProfilePicModal';

const ProfileHeader = () => {
    const { userProfile } = useContext(ProfileContext);
    const { loggedInUser } = useContext(AuthContext);
    const [pictureHovered, setPictureHovered] = useState(false);
    const [showUploadProfilePicModal, setShowUploadProfilePicModal] = useState(false);

    return (
        <>
        <UploadProfilePicModal setShowUploadProfilePicModal={setShowUploadProfilePicModal} showUploadProfilePicModal={showUploadProfilePicModal}/>
        {/* Header Image */}
        <div className="profileHeaderContainer">
            <div className="coverPhotoContainer">
            </div>

            <div className="profileUserImageContainer">
                <div onClick={() => setShowUploadProfilePicModal(true)} onMouseEnter={() => setPictureHovered(true)} onMouseLeave={() => setPictureHovered(false)} className={`${pictureHovered && 'pointer'}`}>
                    <img src={userProfile.profilePicture} alt="" /> 
                    {(userProfile._id === loggedInUser._id && pictureHovered) &&
                        <FontAwesomeIcon icon={faCamera} className={"profilePictureButton"} />
                    }
                </div>
            </div>
        </div>
        


        {/* Buttons allowing to edit the profile or follow depending on status */}
        <div className="profileButtonsContainer">
            {userProfile.username.toLowerCase() === loggedInUser.username.toLowerCase() ?
                <button className='editButton'>
                    Edit Profile
                </button>
                :
                <>
                <Link to={`/messages/${userProfile.username}`} className='messageButton'>
                    <FontAwesomeIcon icon={faEnvelope} />
                </Link>
                <FollowButton user={userProfile._id} styles={'profileFollowButton'}/>
                </>
            }
        </div>
        
        {/* Profile Information */ }
        <div className="userDetailsContainer">
            <span className='displayName'>
                {userProfile.firstName + " " + userProfile.lastName}
            </span>
            <span className="username">
                @{userProfile.username}
            </span>
            <span className="description">
                {userProfile.description}
            </span>

            <div className="followersContainer">
                <span className="value">{userProfile.following.length}</span>
                <Link to={`/profile/${userProfile.username}/following`} >
                    Following
                </Link>
                <span className="value">{userProfile.followers.length}</span>
                <Link to={`/profile/${userProfile.username}/followers`} >
                        {userProfile.followers.length === 1 ? 'Follower' : 'Followers'}
                </Link>
            </div>
        </div>
        
        </>
    )
}

export default ProfileHeader