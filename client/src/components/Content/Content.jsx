import React from 'react'
import { Col } from 'react-bootstrap/';
import './content.css'

const Content = ({ widthOption }) => {

    return (
        <Col className={"mainSectionContainer " + widthOption}>
            <div className="titleContainer">
                <h1 className='titleContainerTitle'>Home</h1>
            </div>
        </Col>
    )
}

export default Content