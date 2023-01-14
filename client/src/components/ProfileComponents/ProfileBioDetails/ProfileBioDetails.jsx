import React from 'react'
import { Link } from 'react-router-dom';
import './profilebiodetails.css'

const ProfileBioDetails = ({user}) => {
    const {firstName, lastName, username, description, following, followers} = user;

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
                <span className="value">{following.length}</span>
                <Link to={`/profile/${username}/following`} >
                    Following
                </Link>
                <span className="value">{followers.length}</span>
                <Link to={`/profile/${username}/followers`} >
                        {followers.length === 1 ? 'Follower' : 'Followers'}
                </Link>
            </div>
        </div>
    )
}

export default ProfileBioDetails