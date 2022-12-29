import React from 'react'

const Posts = ({ posts }) => {
    return (
        <div className="post">
            <div className="mainContentContainer">
                <div className="userImageContainer">
                    <img src={posts.profilePic} alt="" />
                </div>
                <div className="postContentContainer">
                    <div className="header">
                    </div>
                    <div className="postBody">
                        <span>{posts.content}</span>
                    </div>
                    <div className="postFooter">
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Posts