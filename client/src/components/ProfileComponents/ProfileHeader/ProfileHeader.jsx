import React, {useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faCamera } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from '../../../context/AuthContext';
import { ProfileContext } from '../../../context/ProfileContext';
import FollowButton from '../../FollowButton/FollowButton';
import './profileheader.css'
import UploadProfilePicModal from '../../Modals/UploadProfilePicModal/UploadProfilePicModal';
import UploadCoverPhotoModal from '../../Modals/UploadCoverPhotoModal/UploadCoverPhotoModal';

const ProfileHeader = () => {
    const { userProfile } = useContext(ProfileContext);
    const { loggedInUser } = useContext(AuthContext);
    const [pictureHovered, setPictureHovered] = useState(false);
    const [coverHovered, setCoverHovered] = useState(false);
    const [showUploadProfilePicModal, setShowUploadProfilePicModal] = useState(false);
    const [showUploadCoverPhotoModal, setShowUploadCoverPhotoModal] = useState(false);

    return (
        <>
        <UploadProfilePicModal setShowUploadProfilePicModal={setShowUploadProfilePicModal} showUploadProfilePicModal={showUploadProfilePicModal}/>
        <UploadCoverPhotoModal setShowUploadCoverPhotoModal={setShowUploadCoverPhotoModal} showUploadCoverPhotoModal={showUploadCoverPhotoModal} />
        {/* Header Image */}
        <div className="profileHeaderContainer">

            <div 
                onClick={() => setShowUploadCoverPhotoModal(true)} 
                onMouseEnter={() => setCoverHovered(true)} 
                onMouseLeave={() => setCoverHovered(false)} 
                className={`${coverHovered && 'pointer'} coverPhotoContainer`}
            >
                <img src={userProfile.coverPhoto} alt="" /> 
                {(userProfile._id === loggedInUser._id && coverHovered) &&
                    <FontAwesomeIcon icon={faCamera} className={"coverPhotoIcon"} />
                }

            </div>

            <div 
                onClick={() => setShowUploadProfilePicModal(true)} 
                onMouseEnter={() => setPictureHovered(true)} 
                onMouseLeave={() => setPictureHovered(false)} 
                className={`${pictureHovered && 'pointer'} profileUserImageContainer`}
            >

                {loggedInUser._id === userProfile._id ? <img src={loggedInUser.profilePicture} alt="" /> : <img src={userProfile.profilePicture} alt="" />}
                {(userProfile._id === loggedInUser._id && pictureHovered) &&
                    <FontAwesomeIcon icon={faCamera} className={"profilePictureButton"} />
                }

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
                <Link to={`/inbox/${userProfile._id}`} className='messageButton'>
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