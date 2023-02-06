import React from 'react'
import { Col } from 'react-bootstrap/';
import PostForm from '../PostForm/PostForm';
import Posts from '../Posts/Posts';
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext';
import './mainfeed.css'
import PageHeader from '../PageHeader.jsx/PageHeader';

const Content = () => {
    const { loggedInUser } = useContext(AuthContext);
    
    return (
        <Col className={"mainSectionContainer"}>
            <PageHeader title={"Home"}/>
            <PostForm />
            <Posts user={loggedInUser} />
        </Col>
    )
}

export default Content