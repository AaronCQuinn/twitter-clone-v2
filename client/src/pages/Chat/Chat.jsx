import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap/';
import Spinner from '../../components/Spinner/Spinner'
import Navbar from '../../components/Navbar/Navbar';
import PageHeader from '../../components/PageHeader/PageHeader'
import { useParams } from 'react-router-dom';
import { showToast } from '../../components/Toast/showToast';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import './chat.css'
import ChatHeader from '../../components/ChatHeader/ChatHeader';
import ChatBubble from '../../components/ChatBubble/ChatBubble';

const Chat = () => {
    const [loading, setLoading] = useState(true);
    const [chatError, setChatError] = useState(false);
    const [message, setMessage] = useState();
    const [messageArray, setMessageArray] = useState();
    const [chat, setChat] = useState([]);
    const params = useParams();

    useEffect(() => {
        getChatInfo();
        //eslint-disable-next-line
    }, [])

    const getChatInfo = async() => {
        setLoading(true);
        try {
            const [chatInfoResponse, messagesResponse] = await Promise.all([
                fetch(`/api/chats/${params.chatId}`),
                fetch(`/api/messages/${params.chatId}`)
            ]);
            if (chatInfoResponse.ok && messagesResponse.ok) {
                const chatInfo = await chatInfoResponse.json();
                const messages = await messagesResponse.json();
                setChat(chatInfo);
                setMessageArray(messages);
            } else if (chatInfoResponse.status === 401 || messagesResponse.status === 401) {
                setChatError(true);
            }
        } catch(error) {
            console.log(error);
            showToast('error', 'There was an error getting your chat. Please try again.');
        } finally {
            setLoading(false);
        }
    }
    
    const handleChange = (e) => {
        const content = e.target.value;
        if (!content) {
            return;
        }

        setMessage(content);
    }

    const handleEnterPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
            return false;
        }

        return;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim()) {
            return showToast('You cannot send a message without any content.', 'error');
        }

        try {
            axios.post(`/api/messages/`, {content: message, _id: chat._id}, { headers: { 'Content-Type': 'application/json' }})
            .then(response => {
                console.log(response);
                setMessageArray([...messageArray, response.data])
                setMessage('');
            });
        } catch (error) {
            showToast('There was an error sending your message. Please try again!', 'error');
            setMessage(message);
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
                            <ChatHeader fetchedChat={chat} />
                        </div>
                        <div className="mainContentContainer">
                            <div className="chatContainer">

                                <ul className="chatMessages">
                                    {messageArray &&
                                        messageArray.map((message, index) => {
                                            // First and last message, as if they're in a row, non-interupted by another user.
                                            let firstMessageFromUser = false;
                                            let lastMessageFromUser = false;
                                            const { _id: userWhoSentMessage } = message.userSent;
                                            const { _id: nextMessageUser } = index < messageArray.length - 1 && messageArray[index + 1]?.userSent;
                                            const { _id: previousMessageUser } = index > 0 && messageArray[index - 1]?.userSent;

                                            // The first message in the array always is the first.
                                            if (index === 0) {
                                                firstMessageFromUser = true;
                                            }

                                            // The last message in the array always is last.
                                            if (index === messageArray.length - 1) {
                                                lastMessageFromUser = true;
                                            }

                                            // If the message previous to the current isn't the same user, it must be the first.
                                            if (userWhoSentMessage !== previousMessageUser) {
                                                firstMessageFromUser = true;
                                            }

                                            // If the next message to the current isn't the same user, it must be the last.
                                            if (userWhoSentMessage !== nextMessageUser) {
                                                lastMessageFromUser = true;
                                            }

            
                                            return (
                                                <ChatBubble 
                                                    message={message} 
                                                    key={index} 
                                                    index={index} 
                                                    isFirstMessage={firstMessageFromUser} 
                                                    isLastMessage={lastMessageFromUser}
                                                /> 
                                            )
                                        })
                                    }
                                </ul>

                                <form method="post" onSubmit={e => handleSubmit(e)}>
                                    <div className="footer" >
                                        <textarea name="messageInput" placeholder='Type a message...' value={message} onChange={(e) => handleChange(e)} onKeyDown={(event) => handleEnterPress(event)}/>
                                        <button className="sendMessageButton" type='submit'>
                                            <FontAwesomeIcon icon={faPaperPlane} />
                                        </button>
                                    </div>
                                </form>
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