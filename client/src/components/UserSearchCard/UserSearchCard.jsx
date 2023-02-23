import React from 'react'
import './usersearchcard.css'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const UserSearchCard = ({firstName, lastName, username}) => {
    return (
        <div className="userSearchCard">
            <FontAwesomeIcon icon={faXmark} size='xs' className='userSearchCardClose'/>
            <div className=''>{firstName + " " + lastName}</div>
            <span className='userSearchCard'>{"@" + username}</span>
        </div>
    )
}

export default UserSearchCard