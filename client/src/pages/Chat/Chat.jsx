import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap/';
import Spinner from '../../components/Spinner/Spinner'
import Navbar from '../../components/Navbar/Navbar';
import PageHeader from '../../components/PageHeader/PageHeader'
import { useParams } from 'react-router-dom';
import { showToast } from '../../components/Toast/showToast';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './chat.css'
import ChatBubble from '../../components/ChatBubble/ChatBubble';


const Chat = () => {
    const [loading, setLoading] = useState(true);
    const [chatError, setChatError] = useState(false);
    const [chat, setChat] = useState();
    const params = useParams();


    useEffect(() => {
        getMessages();
        //eslint-disable-next-line
    }, [])

    const getMessages = async() => {
        setLoading(true);
        try {
            const response = await fetch(`/api/chats/${params.chatId}`);
            if (response.ok) {
                const messages = await response.json();
                setChat(messages);
            } else if (response.status === 401) {
                setChatError(true)
            }
        } catch(error) {
            console.log(error);
            showToast('error', 'There was an error getting your chat. Please try again.')
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container>
            <Row>
                <Col xs={2}>
                    <Navbar />
                </Col>

                <Col className="col-10 col-md-8 col-lg-6 h-100 flex">
                {loading ? (
                    <Spinner />
                    ) : (
                    chatError ? (
                        <div className="chatUnauthorized">
                            <div>The chat you tried to access either does not exist, or you are not a part of.</div>
                            <div>Please try again.</div>
                        </div>
                    ) : (
                    <div className="chatPageContainer">
                        <PageHeader title={"Chat"} />
                        <div className="chatTitleBarContainer">
                            <ChatBubble fetchedChat={chat} />
                        </div>
                        <div className="mainContentContainer">
                            <div className="chatContainer">
                            <div className="chatMessages">
                                aghjvcghcgfcgfcgf
                            </div>
                            <div className="footer">
                                <textarea name="messageInput" placeholder='Type a message...'></textarea>
                                <button className="sendMessageButton">
                                <FontAwesomeIcon icon={faPaperPlane} />
                                </button>
                            </div>
                            </div>
                        </div>
                    </div>
                    )
                    )}

                </Col>

                <Col xs={2} className='d-none d-md-block col-md-2 col-lg-4'>
                    <span>third column</span>
                </Col>
            </Row>
        </Container>
    )
}

export default Chat