import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRetweet } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import { timeDifference } from '../../util/timeDifference';
import { toast } from 'react-toastify';
import axios from 'axios';
import '../ReplyModal/replymodal.css'

function DeleteModal({deleteModalShow, setDeleteModalShow, modalPost}) {
    const [postError, setPostError] = useState();

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
        axios.delete(`/api/post/${modalPost._id}/`, {},
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
        setDeleteModalShow(false);
        window.location.reload();
    }

    return (
        <Modal
        show={deleteModalShow}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
        <Modal.Header closeButton onClick={() => { setDeleteModalShow(false) }}>
            <Modal.Title id="contained-modal-title-vcenter">
            Are you sure you want to delete this tweet?
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {modalPost &&
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
                    </div>
                </div>
            }
        </Modal.Body>
        <Modal.Footer>
            <Button variant='danger' onClick={onSubmit}>Delete</Button>
            <Button variant='secondary' onClick={() => { setDeleteModalShow(false) }}>Close</Button>
        </Modal.Footer>
        </Modal>
    );
}

export default DeleteModal