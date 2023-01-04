import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { faComment, faRetweet, faHeart } from '@fortawesome/free-solid-svg-icons'
import './posts.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { timeDifference } from '../../util/timeDifference';
import { toast } from 'react-toastify';
import axios from 'axios';
import Spinner from '../Spinner/Spinner';
import ReplyModal from '../ReplyModal/ReplyModal';

const Posts = ({ posts, user, setPosts }) => {
    const [modalShow, setModalShow] = useState(false);
    const [modalPost, setModalPost] = useState();
    const [userLikes, setUserLikes] = useState(user.likes);
    const [userRetweets, setUserRetweets] = useState(user.retweets);
    const [likeAPICall, setLikeAPICall] = useState(false);
    const likeError = 'There was an error liking the post, please try again!';

    const likeErrorToast = () => {
        toast.error(likeError, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
        return;
    }

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
                const { updatePost } = res.data;
                const { retweets } = res.data.returnUser;
                const index = posts.findIndex(post => post._id === updatePost._id);
                setPosts((prevPosts) => {
                    prevPosts[index].retweetUsers = updatePost.retweetUsers;
                    const newPosts = [...prevPosts];
                    return newPosts;
                })
                setUserRetweets(retweets);
            })      
            .catch(error => {
                likeErrorToast();
                console.log(`Error posting to back end: ${error}`);
            })
        .catch(error => {
            likeErrorToast();
            console.log(`Axios request failed: ${error}`);
        })
    }

    const handleLikeClick = async(id) => {
        setLikeAPICall(true);
        axios.put(`/api/posts/${id}/like`, {id},
            {
            headers: {
                'Content-Type': 'application/json'
              }
            })
            .then(res => {
                const { updatePost } = res.data;
                const index = posts.findIndex(post => post._id === updatePost._id);
                setPosts((prevPosts) => {
                    prevPosts[index].likes = res.data.updatePost.likes;
                    const newPosts = [...prevPosts];
                    return newPosts;
                })
                setUserLikes(res.data.returnUser.likes);
            })      
            .catch(error => {
                likeErrorToast();
                console.log(`Error posting to back end: ${error}`);
            })
        .catch(error => {
            likeErrorToast();
            console.log(`Axios request failed: ${error}`);
        })
        setLikeAPICall(false);
    }


    if (!posts) {
        return <></>
    } else {
        return (
        <>
            {posts.map((post) => {
                    return (
                        <div key={post._id} className="post">
                        <div className="mainContentContainer">
                            <div className="postUserImageContainer">
                            <img src={post.postedBy.profilePicture} alt="" />
                            </div>
                            <div className="postContentContainer">
                            <div className="header">
                                {post.retweetData !== undefined &&
                                    <div className='postActionContainer'>
                                        <span>
                                            <FontAwesomeIcon icon={faRetweet} className='postActionContainerIcon' />
                                            {"Retweeted by "} 
                                            <Link className='postActionContainerLink' to={'/profile/' + post.postedBy.username}>
                                                @{post.postedBy.username}
                                            </Link>
                                        </span>
                                    </div>
                                }
                                {post.retweetData ?
                                <>
                                    <Link className='headerLink' to={'/profile/' + post.retweetData.postedBy.username}>
                                        <span>{post.retweetData.postedBy.firstName + " " + post.retweetData.postedBy.lastName}</span>
                                    </Link>
                                    <span className='username'>{"@" + post.retweetData.postedBy.username}</span>
                                    <span className='date'>{timeDifference(new Date(), new Date(post.createdAt))}</span>
                                </>
                                    :
                                <>
                                    <Link className='headerLink' to={'/profile/' + post.postedBy.username}>
                                        <span>{post.postedBy.firstName + " " + post.postedBy.lastName}</span>
                                    </Link>
                                        <span className='username'>{"@" + post.postedBy.username}</span>
                                    <span className='date'>{timeDifference(new Date(), new Date(post.createdAt))}</span>
                                </>
                                }
                            </div>
                            <div className="postBody">
                                {post.retweetData ? 
                                    <span>{post.retweetData.content}</span> 
                                    :
                                    <span>{post.content}</span>
                                }
                            </div>
                            <div className="postFooter">
                                <div className='postButtonContainer'>
                                    {post.retweetData ? 
                                        <button onClick={() => handleReplyClick(post.retweetData)}>
                                            <FontAwesomeIcon icon={faComment} />
                                        </button>
                                        :
                                        <button onClick={() => handleReplyClick(post)}>
                                            <FontAwesomeIcon icon={faComment} />
                                        </button>
                                    }
                                    {post.retweetData === undefined &&
                                        <button onClick={() => {handleRetweetClick(post._id)}}>
                                            <FontAwesomeIcon icon={faRetweet} className={userRetweets?.includes(post._id) ? 'retweetButtonGreen' : 'retweetButtonHover'}/>
                                            <span className='likeButtonCount'>{post.retweetUsers?.length > 0 ? post.retweetUsers.length : ''}</span>
                                        </button>
                                    }
                                    {likeAPICall ? 
                                        <div className="likeButtonContainer">
                                            <Spinner />
                                        </div>
                                    :
                                        <button onClick={() => handleLikeClick(post._id)}>
                                            <div className='likeButtonContainer'>
                                                <FontAwesomeIcon icon={faHeart} className={userLikes.includes(post._id) ? 'likeButtonRed' : 'likeButtonHover'} />
                                                <span className='likeButtonCount'>{post.likes?.length > 0 ? post.likes.length : ''}</span>
                                            </div>
                                        </button>
                                    }
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                    );
                })}
            <ReplyModal modalShow={modalShow} setModalShow={setModalShow} modalPost={modalPost} />
        </>
        );
    };
  };    
export default Posts