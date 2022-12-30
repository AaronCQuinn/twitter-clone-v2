import React from 'react'
import { Link } from 'react-router-dom';
import { faComment, faRetweet, faHeart } from '@fortawesome/free-solid-svg-icons'
import './posts.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { timeDifference } from '../../util/timeDifference';
import { toast } from 'react-toastify';
import axios from 'axios';


const Posts = ({ posts }) => {
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

    const handleLikeClick = async(id) => {
        if (!id) { likeErrorToast() };
        axios.put(`/api/posts/${id}/like`, {id},
            {
            headers: {
                'Content-Type': 'application/json'
              }
            })
            .then(res => {
                console.log(res);
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

    if (!posts) {
        return <></>
    } else {
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
                            <span>{post.postedBy.firstName + " " + post.postedBy.lastName}</span>
                        </Link>
                            <span className='username'>{"@" + post.postedBy.username}</span>
                        <span className='date'>{timeDifference(new Date(), new Date(post.createdAt))}</span>
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
                            <button onClick={() => handleLikeClick(post._id)}>
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
  };    
export default Posts