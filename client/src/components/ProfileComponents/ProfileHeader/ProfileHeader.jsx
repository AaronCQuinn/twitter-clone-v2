import React, {useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faCamera } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from '../../../context/AuthContext';
import FollowButton from '../../FollowButton/FollowButton';
import UploadProfilePicModal from '../../Modals/UploadProfilePicModal/UploadProfilePicModal';
import UploadCoverPhotoModal from '../../Modals/UploadCoverPhotoModal/UploadCoverPhotoModal';
import './profileheader.css'

const ProfileHeader = ({ profile }) => {
    const { loggedInUser } = useContext(AuthContext);
    const [pictureHovered, setPictureHovered] = useState(false);
    const [coverHovered, setCoverHovered] = useState(false);
    const [showUploadProfilePicModal, setShowUploadProfilePicModal] = useState(false);
    const [showUploadCoverPhotoModal, setShowUploadCoverPhotoModal] = useState(false);

    const IS_LOGGED_IN_USERS_PROFILE = loggedInUser._id === profile._id;
    return (
        <>
        <UploadProfilePicModal setShowUploadProfilePicModal={setShowUploadProfilePicModal} showUploadProfilePicModal={showUploadProfilePicModal}/>
        <UploadCoverPhotoModal setShowUploadCoverPhotoModal={setShowUploadCoverPhotoModal} showUploadCoverPhotoModal={showUploadCoverPhotoModal} />
        {/* Header Image */}
        <div className="profileHeaderContainer">

            <div onClick={() => setShowUploadCoverPhotoModal(true)} onMouseEnter={() => setCoverHovered(true)} onMouseLeave={() => setCoverHovered(false)} 
            className={`${coverHovered && 'pointer'} coverPhotoContainer`}>
                <img src={profile.coverPhoto} alt="" /> 
                {(IS_LOGGED_IN_USERS_PROFILE && coverHovered) && <FontAwesomeIcon icon={faCamera} className="coverPhotoIcon" />}
            </div>

            <div onClick={() => setShowUploadProfilePicModal(true)} onMouseEnter={() => setPictureHovered(true)} onMouseLeave={() => setPictureHovered(false)} 
            className={`${pictureHovered && 'pointer'} profileUserImageContainer`}>

                <img src={profile.profilePicture} alt="" />
                {(IS_LOGGED_IN_USERS_PROFILE && pictureHovered) && <FontAwesomeIcon icon={faCamera} className={"profilePictureButton"} />}

            </div>
        </div>
        
        {/* Buttons allowing to edit the profile or follow depending on status */}
        <div className="profileButtonsContainer">
            {IS_LOGGED_IN_USERS_PROFILE ? <button className='editButton'> Edit Profile </button> :
                <>
                <Link to={`/inbox/${profile._id}`} className='messageButton'>
                    <FontAwesomeIcon icon={faEnvelope} />
                </Link>
                <FollowButton styles={'profileFollowButton'} doesRequestingUserFollow={profile.doesRequestingUserFollow} />
                </>
            }
        </div>
        
        {/* Profile Information */ }
        <div className="userDetailsContainer">
            <span className='displayName'>
                {profile.firstName + " " + profile.lastName}
            </span>
            <span className="username">
                @{profile.username}
            </span>
            <span className="description">
                {profile.description}
            </span>

            <div className="followersContainer">
                <span className="value">{profile.followingCount}</span>
                <Link to={`/profile/${profile._id}/following`} >
                    Following
                </Link>
                <span className="value">{profile.followersCount}</span>
                <Link to={`/profile/${profile._id}/followers`} >
                        {profile.followersCount === 1 ? 'Follower' : 'Followers'}
                </Link>
            </div>
        </div>
        
        </>
    )
}

export default ProfileHeader