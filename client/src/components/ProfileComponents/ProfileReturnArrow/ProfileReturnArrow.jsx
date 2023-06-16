import React from 'react'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

const ProfileReturnArrow = ({profileId}) => {
  return (
    <Link to={'/profile/' + profileId + '/tweets'}>
        <FontAwesomeIcon icon={faArrowLeft} className='profileBackArrow' />
    </Link>
  )
}

export default ProfileReturnArrow