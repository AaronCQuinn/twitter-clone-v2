import React from 'react'
import { Link } from 'react-router-dom';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'react-router-dom'
import './profilebiobuttons.css'

const ProfileBioButtons = ({ user }) => {

    const { username } = useParams();
    return (
        <div className="profileButtonsContainer">
            {username.toLowerCase() === user.username.toLowerCase() &&
                <Link to={`/messages/${username}`} className='messageButton' >
                    <FontAwesomeIcon icon={faEnvelope} />
                </Link>
            }

            <button className='followButton'>
                Follow
            </button>
        </div>
    )
}

export default ProfileBioButtons