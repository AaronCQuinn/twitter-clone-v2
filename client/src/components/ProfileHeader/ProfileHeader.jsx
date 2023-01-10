import React from 'react'
import './profileheader.css'

const ProfileHeader = ({ user }) => {
    return (
        <div className="profileHeaderContainer">
            <div className="coverPhotoContainer">
                <div className="profileUserImageContainer">
                    <img src={user.profilePicture} alt="User profile image" />
                </div>
            </div>
        </div>
    )
}

export default ProfileHeader