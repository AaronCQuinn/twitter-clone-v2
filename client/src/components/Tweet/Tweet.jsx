import React, { useState } from 'react'
import axios from 'axios';
import { showToast } from '../../components/Toast/showToast'
import { Link, useNavigate } from 'react-router-dom';
import { faComment, faRetweet, faHeart, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { timeDifference } from '../../util/timeDifference';
import ReplyModal from '../ReplyModal/ReplyModal';
import DeleteModal from '../DeleteModal/DeleteModal';
import './tweet.css'

const Tweet = ({ post, user }) => {
    const [modalShow, setModalShow] = useState(false);
    const [modalPost, setModalPost] = useState();
    const [deleteModalShow, setDeleteModalShow] = useState();
    const [postHover, setPostHover] = useState(false);
    const navigate = useNavigate();

    const handleReplyClick = (post, event) => {
        event.stopPropagation();
        setModalShow(true);
        setModalPost(post);
    }

    const handleRetweetClick = async(id, event) => {
        event.stopPropagation();
        axios.post(`/api/posts/${id}/retweet`, {id},
            {
            headers: {
                'Content-Type': 'application/json'
            }
            })
            .then(() => {
                window.location.reload();
            })      
            .catch(error => {
                showToast('There was an error liking the post, please try again!', 'error');
                console.log(`Error posting to back end: ${error}`);
            })
        .catch(error => {
            showToast('There was an error liking the post, please try again!', 'error');
            console.log(`Axios request failed: ${error}`);
        })
    }

    const handleLikeClick = async (id, event) => {
        event.stopPropagation();
        try {
          await axios.put(`/api/posts/${id}/like`, { id }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          window.location.reload();
        } catch (error) {
          showToast('There was an error liking the post, please try again!', 'error');
          console.log(`Error posting to back end: ${error}`);
        }
    };
      
    const handleDeleteClick = (post, event) => {
        event.stopPropagation();
        setDeleteModalShow(true);
        setModalPost(post);
    }

    const handlePostClick = (id) => {
        navigate(`/post/${id}`);
    }

    let username, firstName, lastName, profilePicture;
    post.retweetData ? 
    ({ username, firstName, lastName, profilePicture } = post.retweetData.postedBy)
    : 
    ({ username, firstName, lastName, profilePicture } = post.postedBy);

    return (
    <>   
    <div
      className={`post ${postHover ? 'hovered' : ''}`}
      onMouseEnter={() => setPostHover(true)}
      onMouseLeave={() => setPostHover(false)}
    >
    <div className="mainContentContainer">

        <div className="postUserImageContainer">
            <img src={profilePicture} alt="" />
        </div>

        <div className="postContentContainer">

            <div className="header">

                {post.retweetData &&
                    <div className='postActionContainer'>
                        <span>
                            <FontAwesomeIcon icon={faRetweet} className='postActionContainerIcon' />
                            {"Retweeted by "} 
                            <Link className={`postActionContainerLink ${postHover ? 'linkHovered' : ''}`} to={'/profile/' + username}>
                                @{username}
                            </Link>
                        </span>
                    </div>
                }

                <div className="tweetUserInfo">
                    <div>
                        <Link className={`headerLink  ${postHover ? 'linkHovered' : ''}`} to={'/profile/' + username} >
                            <span>{firstName + " " + lastName}</span>
                        </Link>
                        <span className='username'>{"@" + username}</span>
                        <span className='date'>{timeDifference(new Date(), new Date(post.createdAt))}</span>
                    </div>

                    {(post.postedBy._id === user._id && !post.retweetData) &&    
                    <div className="deleteButtonContainer">                
                        <FontAwesomeIcon icon={faTrashCan} className='deleteButton' onClick={(event) => handleDeleteClick(post.retweetData ? post.retweetData : post, event)} />
                    </div>
                    }
                </div>
            </div>

        <div className="postBody" onClick={() => handlePostClick(post._id)}>

            {post.replyTo && 
                <div className='postActionContainer'>
                    <FontAwesomeIcon icon={faComment} className='commentButtonBlue' />
                    <span>Replying to</span>
                    <Link className='postActionContainerLink' to={'/profile/' + username}>
                        <span>
                            {"@" + username}
                        </span>
                    </Link>
                </div>
            }

            <span>{post.retweetData ? post.retweetData.content : post.content}</span> 

        </div>

        <div className="postFooter">
            <div className='postButtonContainer'>

                <button onClick={(e) => handleReplyClick(post.retweetData ? post.retweetData : post, e)}>
                    <FontAwesomeIcon icon={faComment} className='commentButtonBlue' />
                </button>

                {post.retweetData === undefined &&
                    <button onClick={(e) => {handleRetweetClick(post._id, e)}}>
                        <FontAwesomeIcon icon={faRetweet} className={post.retweetUsers.includes(user._id) ? 'retweetButtonGreen' : 'retweetButtonHover'}/>
                        <span className='likeButtonCount'>{post.retweetUsers?.length > 0 ? post.retweetUsers.length : ''}</span>
                    </button>
                }

                <button onClick={(e) => handleLikeClick(post._id, e)}>
                    <div className='likeButtonContainer'>
                        <FontAwesomeIcon icon={faHeart} className={post.likes.includes(user._id) ? 'likeButtonRed' : 'likeButtonHover'} />
                        <span className='likeButtonCount'>{post.likes?.length > 0 ? post.likes.length : ''}</span>
                    </div>
                </button>
                
            </div>
        </div>
        </div>
    </div>
    </div>
    <DeleteModal deleteModalShow={deleteModalShow} setDeleteModalShow={setDeleteModalShow} modalPost={modalPost} />
    <ReplyModal modalShow={modalShow} setModalShow={setModalShow} modalPost={modalPost} />
    </>
    )
}

export default Tweet