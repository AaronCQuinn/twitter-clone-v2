import React from 'react'
import { Link } from 'react-router-dom';
import { faComment, faRetweet, faHeart } from '@fortawesome/free-solid-svg-icons'
import './posts.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const Posts = ({ posts }) => {
    return (
      <>
        {posts.map((post, index) => {
          return (
            <div key={index} className="post">
              <div className="mainContentContainer">
                <div className="userImageContainer">
                  <img src={post.postedBy.profilePicture} alt="" />
                </div>
                <div className="postContentContainer">
                  <div className="header">
                    <Link className='headerLink' to={'/profile/' + post.postedBy.username}>
                        <span>{" " + post.postedBy.firstName + " " + post.postedBy.lastName}</span>
                    </Link>
                        <span className='username'>{" @" + post.postedBy.username}</span>
                    <span className='date'> {post.createdAt}</span>
                  </div>
                  <div className="postBody">
                    <span>{post.content}</span>
                  </div>
                  <div className="postFooter">
                    <div className='postButtonContainer'>
                        <button>
                            <FontAwesomeIcon icon={faComment} />
                        </button>
                        <button>
                            <FontAwesomeIcon icon={faRetweet} />
                        </button>
                        <button>
                            <FontAwesomeIcon icon={faHeart} />
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  };    
export default Posts