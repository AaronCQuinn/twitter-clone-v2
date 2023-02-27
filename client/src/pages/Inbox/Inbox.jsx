import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { Container, Row, Col } from 'react-bootstrap/';
import Navbar from '../../components/Navbar/Navbar';
import './inbox.css'
import MessageCreation from '../../components/MessageCreation/MessageCreation';
import InboxMessageContainer from '../../components/InboxMessageContainer/InboxMessageContainer';

const Inbox = () => {
    const [createMessage, setCreateMessage] = useState(false);

    useEffect(() => {
        document.title = 'Inbox ● Twitter';
    }, []);
    
    return (
        <Container>
            <Row>
                <Col xs={2}>
                    <Navbar />
                </Col>

                <Col className="col-10 col-md-8 col-lg-6">
                    <div className="titleContainer">
                        <h1 className='titleContainerTitle'>Inbox</h1>
                        <FontAwesomeIcon icon={faPlusSquare} onClick={() => setCreateMessage(!createMessage)} style={{cursor: 'pointer'}} />
                    </div>

                    {createMessage ? 
                    <MessageCreation />
                    :
                    <InboxMessageContainer />
                    }

                </Col>

                <Col xs={2} className='d-none d-md-block col-md-2 col-lg-4'>
                    <span>third column</span>
                </Col>
            </Row>
        </Container>
)
}

export default Inbox