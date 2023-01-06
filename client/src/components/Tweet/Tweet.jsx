import React, { useState } from 'react'
import axios from 'axios';
import { showToast } from '../../components/Toast/showToast'
import { Link, useNavigate } from 'react-router-dom';
import { faComment, faRetweet, faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { timeDifference } from '../../util/timeDifference';
import ReplyModal from '../ReplyModal/ReplyModal';

const Tweet = ({ post, user }) => {
    const [modalShow, setModalShow] = useState(false);
    const [modalPost, setModalPost] = useState();
    const navigate = useNavigate();

    const handleReplyClick = (post) => {
        setModalShow(true);
        setModalPost(post);
    }

    const handleRetweetClick = async(id) => {
        axios.post(`/api/posts/${id}/retweet`, {id},
            {
            headers: {
                'Content-Type': 'application/json'
            }
            })
            .then(res => {
                // const { updatePost } = res.data;
                // const { retweets } = res.data.returnUser;
                // const index = posts.findIndex(post => post._id === updatePost._id);
                // setPosts((prevPosts) => {
                //     prevPosts[index].retweetUsers = updatePost.retweetUsers;
                //     const newPosts = [...prevPosts];
                //     return newPosts;
                // })
                // setUserRetweets(retweets);
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

    const handleLikeClick = async(id) => {
        axios.put(`/api/posts/${id}/like`, {id},
            {
            headers: {
                'Content-Type': 'application/json'
              }
            })
            .then(res => {
                // const { updatePost } = res.data;
                // const index = posts.findIndex(post => post._id === updatePost._id);
                // setPosts((prevPosts) => {
                //     prevPosts[index].likes = res.data.updatePost.likes;
                //     const newPosts = [...prevPosts];
                //     return newPosts;
                // })
                // setUserLikes(res.data.returnUser.likes);
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
    <div className="post" onClick={() => handlePostClick(post._id)}>
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
                            <Link className='postActionContainerLink' to={'/profile/' + username}>
                                @{username}
                            </Link>
                        </span>
                    </div>
                }

                <Link className='headerLink' to={'/profile/' + username} >
                    <span>{firstName + " " + lastName}</span>
                </Link>
                <span className='username'>{"@" + username}</span>
                <span className='date'>{timeDifference(new Date(), new Date(post.createdAt))}</span>

            </div>

        <div className="postBody">

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

                <button onClick={() => handleReplyClick(post.retweetData ? post.retweetData : post)}>
                    <FontAwesomeIcon icon={faComment} className='commentButtonBlue' />
                </button>

                {post.retweetData === undefined &&
                    <button onClick={() => {handleRetweetClick(post._id)}}>
                        <FontAwesomeIcon icon={faRetweet} className={post.retweetUsers.includes(user._id) ? 'retweetButtonGreen' : 'retweetButtonHover'}/>
                        <span className='likeButtonCount'>{post.retweetUsers?.length > 0 ? post.retweetUsers.length : ''}</span>
                    </button>
                }

                <button onClick={() => handleLikeClick(post._id)}>
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
    <ReplyModal modalShow={modalShow} setModalShow={setModalShow} modalPost={modalPost} />
    </>
    )
}

export default Tweet