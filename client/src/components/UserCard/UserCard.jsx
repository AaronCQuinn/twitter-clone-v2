import React from 'react'
import './usercard.css'
import { Link } from 'react-router-dom'
import FollowButton from '../FollowButton/FollowButton'

const UserCard = ({ post }) => {
  const { profilePicture, firstName, lastName, username, _id, description} = post;
  console.log(post);
  return (
    <div className='userCardContainer'>

      <div className='userImageContainer'>
        <img src={profilePicture} alt="The users profile identifier." />
      </div>

      <div className='userCardDetailsContainer'>
        <Link 
        className={`postActionContainerLink `}
        to={'/profile/' + username + '/posts'}>{firstName + " " + lastName}
        </Link>
        <span className='username'>{"@" + username}</span>
        <div className='description'>{description}</div>
      </div>

      <div className='userCardFollowBtnContainer'>
        <FollowButton styles={'userCardFollowBtn'} idToFollow={_id} />
      </div>
    </div>
  )
}

export default UserCard