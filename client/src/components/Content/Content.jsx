import React from 'react'
import { Col } from 'react-bootstrap/';
import PostForm from '../PostForm/PostForm';
import './content.css'

const Content = ({ widthOption }) => {

    return (
        <Col className={"mainSectionContainer " + widthOption}>
            <div className="titleContainer">
                <h1 className='titleContainerTitle'>Home</h1>
            </div>
            <PostForm />
        </Col>
    )
}

export default Content