import React from 'react'
import { Col } from 'react-bootstrap/';
import PostForm from '../PostForm/PostForm';
import Posts from '../Posts/Posts';
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext';
import './mainfeed.css'

const Content = () => {
    const { loggedInUser } = useContext(AuthContext);
    
    return (
        <Col className={"mainSectionContainer"}>
            <div className="titleContainer">
                <h1 className='titleContainerTitle'>Home</h1>
            </div>
            <PostForm />
            <Posts user={loggedInUser} />
        </Col>
    )
}

export default Content