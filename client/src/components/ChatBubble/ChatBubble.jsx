import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import './chatbubble.css'

const ChatBubble = ({message, isFirstMessage, isLastMessage, index}) => {
    const { loggedInUser } = useContext(AuthContext);
    const isUsersMessage = message.userSent._id === loggedInUser._id;
    const { firstName, lastName } = message.userSent;

    return (
        <>
            {(!isUsersMessage && isFirstMessage) && <span className='senderName'>{firstName + " " + lastName}</span>}
            <li className={`message ${isUsersMessage ? 'isUsers' : 'isOthers'} ${isFirstMessage && 'firstMessage'} ${index === 0 && 'firstMessage'} ${isLastMessage && 'lastMessage'}`}>
                <div className='messageContainer' title={new Date(message.createdAt).toLocaleString('eu-US', {hour12: true})}>
                    <span className='messageBody'>{message.content}</span>
                </div>
            </li>
        </>
    )
}

export default ChatBubble