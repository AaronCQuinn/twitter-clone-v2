import React from 'react'
import { Link } from 'react-router-dom';
import './profilebiodetails.css'

const ProfileBioDetails = ({user}) => {
    const {firstName, lastName, username, description} = user;

    return (
        <div className="userDetailsContainer">
            <span className='displayName'>
                {firstName + " " + lastName}
            </span>
            <span className="username">
                @{username}
            </span>
            <span className="description">
                {description}
            </span>

            <div className="followersContainer">
                <span className="value">0</span>
                <Link to={`/profile/${username}/following`} >
                    Following
                </Link>
                <span className="value">0</span>
                <Link to={`/profile/${username}/followers`} >
                    Followers
                </Link>
            </div>
        </div>
    )
}

export default ProfileBioDetails