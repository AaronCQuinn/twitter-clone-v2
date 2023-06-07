import React, { useState } from 'react'
import axios from 'axios';
import { showToast } from '../../components/Toast/showToast'
import { Link, useNavigate } from 'react-router-dom';
import { faComment, faRetweet, faHeart, faTrashCan, faThumbTack } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { timeDifference } from '../../util/timeDifference';
import ReplyModal from '../Modals/ReplyModal/ReplyModal';
import DeleteModal from '../Modals/DeleteModal/DeleteModal';
import './tweet.css'
import UserImageBubble from '../UserImageBubble/UserImageBubble';

const Tweet = ({ post, user }) => {
    const [modalShow, setModalShow] = useState(false);
    const [modalPost, setModalPost] = useState();
    const [deleteModalShow, setDeleteModalShow] = useState();
    const navigate = useNavigate();

    const handleReplyClick = (post, event) => {
        event.stopPropagation();
        setModalShow(true);
        setModalPost(post);
    }

    const handleRetweetClick = async(id, event) => {
        event.stopPropagation();

        try {
            axios.post(`/api/tweets/retweet_tweet/${id}`, {id}, { headers: { 'Content-Type': 'application/json' }})
        } catch(error) {
            showToast('There was an error liking the post, please try again!', 'error');
        }
    }

    const handleLikeClick = async (id, event) => {
        event.stopPropagation();

        try {
          await axios.put(`/api/tweets/like_tweet/${id}`, { id }, { headers: { 'Content-Type': 'application/json',}});
        } catch (error) {
          showToast('There was an error liking the post, please try again!', 'error');
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

    const handlePinClick = async (id) => {
        try {
            await axios.put(`/api/tweets/pin_tweet/${id}`, { id }, { headers: {'Content-Type': 'application/json',}});
          } catch (error) {
            showToast('There was an error liking the post, please try again!', 'error');
          }
    }

    const isRetweet = post.retweetData ? true : false;
    const isReply = post.replyTo ? true : false;
    const { username, firstName, lastName, profilePicture } = isRetweet ? post.retweetData.postedBy : post.postedBy;
    
    let isPinned;
    if (!isRetweet) {
        isPinned = true && (post.pinned && post.postedBy._id === user._id);
    }


    return (
        <>   
        <div className="tweet">
            <div className="tweetContainer">
                <UserImageBubble img={profilePicture} />

                <div className="tweetContent">
                    <div>

                    {isPinned && 
                        <span className='pinnedPostText'>
                            <FontAwesomeIcon icon={faThumbTack} className='postActionContainerIcon' /> Pinned Post
                        </span>
                    }

                    {isRetweet &&
                        <div className='postActionContainer'>
                            <Link className="postActionContainerLink" to={'profile/' + username + '/posts'}>
                                <FontAwesomeIcon icon={faRetweet} className='postActionContainerIcon' />
                                <span className='postActionContainerText'>Retweeted by </span>
                                <span>@{username}</span>
                            </Link>
                        </div>
                    }

                <div className="tweetUserInfo">
                    <div>
                        <Link className="postActionContainerLink" to={'/profile/' + username + '/posts'}>{firstName + " " + lastName}</Link>
                        <span className='username'>{"@" + username}</span>
                        <span className='date'>{timeDifference(new Date(), new Date(post.createdAt))}</span>
                    </div>

                    {(post.postedBy._id === user._id && !isRetweet) &&    
                    <div className="deleteButtonContainer">
                        <FontAwesomeIcon icon={faThumbTack} className={`pointer pinButton ${post.pinned && 'pinned'}`} onClick={(event) => handlePinClick(post._id, event)} />
                        <FontAwesomeIcon icon={faTrashCan} className='deleteButton pointer' onClick={(event) => handleDeleteClick(post.retweetData ? post.retweetData : post, event)} />
                    </div>}
                </div>

            </div>

            <div className="tweetBody" onClick={() => handlePostClick(post._id)}>
                {isReply && 
                    <div className='postActionContainer'>
                        <FontAwesomeIcon icon={faComment} className='commentButtonBlue' />
                        <span>Replying to</span>
                            <span className="postActionContainerLink"
                            onClick={() => navigate('/profile/' + username)}
                            >   
                                {post.replyTo.postedBy.username ? "@" + post.replyTo.postedBy.username : username}
                            </span>
                    </div>
                }

                <span>{post.retweetData ? post.retweetData.content : post.content}</span> 
            </div>

        <div className="postFooter">
            <div className='postButtonContainer'>

                <button onClick={(e) => handleReplyClick(isRetweet ? post.retweetData : post, e)}>
                    <FontAwesomeIcon icon={faComment} className='commentButtonBlue' />
                </button>

                {!isRetweet &&
                    <button onClick={(e) => {handleRetweetClick(post._id, e)}}>
                        <FontAwesomeIcon icon={faRetweet} className={post.retweetUsers.includes(user._id) ? 'retweetButtonGreen' : 'retweetButtonHover'}/>
                        <span className='likeButtonCount'>{post.retweetUsers?.length > 0 ? post.retweetUsers.length : ''}</span>
                    </button>
                }

                <button onClick={(e) => handleLikeClick(post._id, e)}>
                    <div className='likeButtonContainer'>
                        <FontAwesomeIcon icon={faHeart} className={post.likes.includes(user._id) ? 'likeButtonRed' : 'likeButtonHover'} />
                        <div className='likeButtonCount'>{post.likes?.length > 0 ? post.likes.length : ''}</div>
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