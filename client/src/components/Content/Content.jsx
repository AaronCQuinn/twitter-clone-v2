import React from 'react'
import { Col } from 'react-bootstrap/';
import PostForm from '../PostForm/PostForm';
import Posts from '../Posts/Posts';
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext';
import './content.css'

const Content = ({ widthOption }) => {
    const { state } = useContext(AuthContext);

    return (
        <Col className={"mainSectionContainer " + widthOption}>
            <div className="titleContainer">
                <h1 className='titleContainerTitle'>Home</h1>
            </div>
            <PostForm />
            <Posts user={state.user} />
        </Col>
    )
}

export default Content