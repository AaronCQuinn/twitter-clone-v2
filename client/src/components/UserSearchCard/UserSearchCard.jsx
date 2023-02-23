import React from 'react'
import './usersearchcard.css'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const UserSearchCard = ({firstName, lastName, username}) => {
    return (
      <div className="userSearchCard">
        <FontAwesomeIcon icon={faTimes} size="xs" className="userSearchCardClose" />
        <div className="userSearchCardName">{firstName + " " + lastName}</div>
        <div className="userSearchCardUsername">{"@" + username}</div>
      </div>
    )
  }
  

export default UserSearchCard