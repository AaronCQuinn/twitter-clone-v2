import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import './chatbubble.css'

const ChatBubble = ({message, nextMessage, prevMessage, index}) => {
    const { loggedInUser } = useContext(AuthContext);
    const isUsersMessage = message.userSent._id === loggedInUser._id;
    const { firstName, lastName } = message.userSent;

    const nextSender = nextMessage !== undefined ? nextMessage.userSent : ''; // If the next message exists, grabs the user from the message.
    const prevSender = prevMessage !== undefined ? prevMessage.userSent : ''; // If the last sender doesnt equal the current messages sender, it must be the first message from a new user.
    const firstMessage = prevSender._id !== message.userSent._id;
    const lastMessage = nextSender._id !== message.userSent._id;

    return (
        <li className={`message ${isUsersMessage ? 'isUsers' : 'isOthers'} ${firstMessage && 'firstMessage'} ${index === 0 && 'firstMessage'} ${lastMessage && 'lastMessage'}`}>
            <div className='messageContainer' title={new Date(message.createdAt).toLocaleString('eu-US', {hour12: true})}>
                <span className='messageBody'>{message.content}</span>
            </div>
        </li>
    )
}

export default ChatBubble