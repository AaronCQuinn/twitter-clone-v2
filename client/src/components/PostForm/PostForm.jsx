import React from 'react'
import { AuthContext } from '../../context/AuthContext';
import { useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import './postForm.css'

const PostForm = () => {
    const [text, setText] = useState("");
    const [postError, setPostError] = useState();
    const authContext = useContext(AuthContext);
    const {profilePicture} = authContext.state.user;

    const onSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/posts', text,
            {
            headers: {
                'Content-Type': 'application/json'
              }
            })
            .then(res => {

            })              
            .catch(error => {
                setPostError('There was an error posting your tweet. Please try again!');
                console.log(`Error posting to back end: ${error}`);
            })
        .catch(error => {
            setPostError('There was an error posting your tweet. Please try again!');
            console.log(`Axios request failed: ${error}`);
        })
        setText("");
        e.target.reset();
    }

    return (
        <div className="postFormContainer">
            <div className="userImageContainer">
                <img src={profilePicture} alt="The users profile identifier." />
            </div>
                <div className="textareaContainer">
                    <form onSubmit={onSubmit}>
                        <textarea id="postTextArea" value={text} onChange={(e) => setText(e.target.value)} placeholder="What's happening?" />
                        <div className="buttonsContainer">
                            <Button id="submitPostButton" disabled={!Boolean(text.trim())}>Post</Button>
                        </div>
                    </form>
                </div>
        </div>
    )
}

export default PostForm