import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { AuthContext } from '../../context/AuthContext';
import { useContext, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRetweet } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import { timeDifference } from '../../util/timeDifference';
import { toast } from 'react-toastify';
import axios from 'axios';
import './replymodal.css'

function ReplyModal({modalShow, setModalShow, modalPost, setReplyPostID}) {
    const [content, setContent] = useState("");
    const [postError, setPostError] = useState();
    const authContext = useContext(AuthContext);
    const { profilePicture } = authContext.state.user;

    useEffect(() => {
        toast.error(postError, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }, [postError])

    const onSubmit = (e) => {
        e.preventDefault();
        axios.modalPost('/api/posts', {content},
            {
            headers: {
                'Content-Type': 'application/json'
              }
            })
            .then(res => {
                console.log(res);
            })              
            .catch(error => {
                setPostError('There was an error posting your reply. Please try again!');
                console.log(`Error posting to back end: ${error}`);
            })
        .catch(error => {
            setPostError('There was an error posting your reply. Please try again!');
            console.log(`Axios request failed: ${error}`);
        })
        setContent("");
        e.target.reset();
    }

    return (
        <Modal
        show={modalShow}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
        <Modal.Header closeButton         
        onClick={() => { 
                setModalShow(false) 
                setReplyPostID("")
            }}>
            <Modal.Title id="contained-modal-title-vcenter">
            Reply
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div key={modalPost._id} className="modalPost">
                <div className="mainContentContainer">
                    <div className="postUserImageContainer">
                    <img src={modalPost.postedBy.profilePicture} alt="" />
                    </div>
                    <div className="postContentContainer">
                    <div className="header">
                        {modalPost.retweetData !== undefined &&
                            <div className='postActionContainer'>
                                <span>
                                    <FontAwesomeIcon icon={faRetweet} className='postActionContainerIcon' />
                                    {"Retweeted by "} 
                                    <Link className='postActionContainerLink' to={'/profile/' + modalPost.postedBy.username}>
                                        @{modalPost.postedBy.username}
                                    </Link>
                                </span>
                            </div>
                        }
                        <Link className='headerLink' to={'/profile/' + modalPost.postedBy.username}>
                            <span>{modalPost.postedBy.firstName + " " + modalPost.postedBy.lastName}</span>
                        </Link>
                            <span className='username'>{"@" + modalPost.postedBy.username}</span>
                        <span className='date'>{timeDifference(new Date(), new Date(modalPost.createdAt))}</span>
                    </div>
                    <div className="postBody">
                        <span>{modalPost.content}</span>
                    </div>
                </div>
                <div className="modalPostFormContainer">
                    <div className="userImageContainer">
                        <img src={profilePicture} alt="The users profile identifier." />
                    </div>
                    <div className="textareaContainer">
                        <form onSubmit={onSubmit}>
                            <textarea id="postTextArea" value={content} onChange={(e) => setContent(e.target.value)} placeholder="What's happening?" />
                        </form>
                    </div>
                </div>
                </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button type='submit' disabled={!Boolean(content.trim())}>Reply</Button>
            <Button variant='secondary' 
            onClick={() => { 
                setModalShow(false) 
                setReplyPostID("")
            }}>
            Close</Button>
        </Modal.Footer>
        </Modal>
    );
}

export default ReplyModal