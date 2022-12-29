import React, { useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext';
import { useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import './postForm.css'

const PostForm = ({ getPosts }) => {
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
        axios.post('/api/posts', {content},
            {
            headers: {
                'Content-Type': 'application/json'
              }
            })
            .then(res => {
                console.log(res);
                getPosts();
            })              
            .catch(error => {
                setPostError('There was an error posting your tweet. Please try again!');
                console.log(`Error posting to back end: ${error}`);
            })
        .catch(error => {
            setPostError('There was an error posting your tweet. Please try again!');
            console.log(`Axios request failed: ${error}`);
        })
        setContent("");
        e.target.reset();
    }

    return (
        <div className="postFormContainer">
            <div className="userImageContainer">
                <img src={profilePicture} alt="The users profile identifier." />
            </div>
                <div className="textareaContainer">
                    <form onSubmit={onSubmit}>
                        <textarea id="postTextArea" value={content} onChange={(e) => setContent(e.target.value)} placeholder="What's happening?" />
                        <div className="buttonsContainer">
                            <Button id="submitPostButton" disabled={!Boolean(content.trim())} type="submit">Post</Button>
                        </div>
                    </form>
                </div>
        </div>
    )
}

export default PostForm