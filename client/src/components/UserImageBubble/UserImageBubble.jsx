import React from 'react'

const UserImageBubble = ({ img }) => {
    return (
        <div className="postUserImageContainer">
            <img src={img} alt="" />
        </div>
    )
}

export default UserImageBubble