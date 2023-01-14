import React from 'react'
import './profileheader.css'

const ProfileHeader = ({ user }) => {
    return (
        <div className="profileHeaderContainer">
            <div className="coverPhotoContainer">
                <div className="profileUserImageContainer">
                    <img src={user.profilePicture} alt="" />
                </div>
            </div>
        </div>
    )
}

export default ProfileHeader