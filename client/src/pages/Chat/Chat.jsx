import React, { useEffect, useState, useContext } from 'react'
import { Container, Row, Col } from 'react-bootstrap/';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import Spinner from '../../components/Spinner/Spinner'
import Navbar from '../../components/Navbar/Navbar';
import PageHeader from '../../components/PageHeader/PageHeader'
import ChatHeader from '../../components/ChatHeader/ChatHeader';
import ChatMessages from '../../components/ChatMessages/ChatMessages';
import { showToast } from '../../components/Toast/showToast';

import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './chat.css'
import { SocketContext } from '../../context/SocketContext';

const Chat = () => {
    const { socket } = useContext(SocketContext);
    const [loading, setLoading] = useState(true);
    const [chatError, setChatError] = useState(false);
    const [message, setMessage] = useState();
    const [messageArray, setMessageArray] = useState([]);
    const [chat, setChat] = useState([]);
    const [joinedRoom, setJoinedRoom] = useState(false);
    const [socketTyping, setSocketTyping] = useState(false);
    const params = useParams();

    let typingTimer;
    const TIMER_LENGTH = 3000;

    function updateTypingNotification() {
        socket.emit('typing', chat._id);
        typingTimer = new Date().getTime();

        setTimeout(() => {
            const TIME_NOW = new Date().getTime();
            let timeDifference = TIME_NOW - typingTimer;

            if (timeDifference >= TIMER_LENGTH) {
                socket.emit('stop typing', chat._id);
            }

        }, TIMER_LENGTH);
    }

    useEffect(() => {
        getChatInfo();
        //eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (chat._id && !joinedRoom) {
          socket.emit('join room', chat._id);
          setJoinedRoom(true);
        }
    }, [chat._id, joinedRoom, socket]);
    
    useEffect(() => {
        if (socket) {
            socket.on('new message', (newMessage) => {
                console.log('Hit')
                setMessageArray(prevArray => [...prevArray, newMessage]);
            })

            socket.on('typing', () => {
                setSocketTyping(true);
            })

            socket.on('stop typing', () => {
                setSocketTyping(false);
            })
            
            return () => {
                socket.off('new message');
            }
        }
    }, [socket])

    const getChatInfo = async() => {
        setLoading(true);

        try {
            const [chatInfoResponse, messagesResponse] = await Promise.all([
                fetch(`/api/chats/fetch_dm/${params.chatId}`),
                fetch(`/api/chats/fetch_dm/messages/${params.chatId}`)
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
        updateTypingNotification();
        setMessage(e.target.value);
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
        socket.emit('stop typing', chat._id);

        if (!message.trim()) {
            return showToast('You cannot send a message without any content.', 'error');
        }

        try {
            axios.post(`/api/chats/post_message`, {content: message, _id: chat._id}, { headers: { 'Content-Type': 'application/json' }})
            .then(response => {
                socket.emit('new message', response.data);
                setMessageArray(prevArray => [...prevArray, response.data])
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
                {loading ? <Spinner /> : 
                    chatError ?
                        <div className="chatUnauthorized">
                            <div>The chat you tried to access either does not exist, or you are not a part of.</div>
                            <div>Please try again.</div>
                        </div>
                    :
                    <div className="chatPageContainer" >

                        <PageHeader title={"Chat"} />

                        <div className="chatTitleBarContainer">
                            <ChatHeader fetchedChat={chat} />
                        </div>

                        <div className="mainContentContainer">
                            
                            <div className="chatContainer">

                                <ChatMessages messageArray={messageArray} isTyping={socketTyping}/>
                                <form method="post" onSubmit={e => handleSubmit(e)}>
                                    <div className="footer" >
                                        <textarea name="messageInput" placeholder='Type a message...' value={message} onChange={(e) => handleChange(e)} onKeyDown={(event) => handleEnterPress(event)} />
                                        <button className="sendMessageButton" type='submit'>
                                            <FontAwesomeIcon icon={faPaperPlane} />
                                        </button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                    }

                </Col>

                <Col xs={2} className='d-none d-md-block col-md-2 col-lg-4'>
                    <span>third column</span>
                </Col>
            </Row>
        </Container>
    )
}

export default Chat