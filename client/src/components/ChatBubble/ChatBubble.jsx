import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import './chatbubble.css'

const ChatBubble = ({message}) => {
    const { loggedInUser } = useContext(AuthContext);
    const isUsersMessage = message.userSent._id === loggedInUser._id;

    return (
        <li className={`message ${isUsersMessage && 'isUsers'}`}>
            <div className='messageContainer'>
                <span className='messageBody'>{message.content}</span>
            </div>
        </li>
    )
}

export default ChatBubble