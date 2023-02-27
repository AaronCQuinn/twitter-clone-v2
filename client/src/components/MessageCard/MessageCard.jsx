import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import './messagecard.css'

const MessageCard = ({ chat }) => {
    const { loggedInUser } = useContext(AuthContext);
    console.log(chat);
    const latestMessage = 'Latest message.'

    const setChatName = () => {
        let chatName = chat.chatName;
        if (!chat.chatName) {
            let chatUsers = otherChatUsers(chat.users);
            const chatNames = chatUsers.map(user => user.firstName + " " + user.lastName); 
            chatName = chatNames.join(', ');
        }

        return chatName;
    }

    const otherChatUsers = (users) => {
        if (users.length === 1) return users;
        return users.filter(user => user._id !== loggedInUser._id);
    }

    const chatName = setChatName();

    return (
        <Link to={`/inbox/messages/${chat._id}`} className='resultListItem'>
            <div className='resultsDetailsContainer'>
                <span className='heading'>{chatName}</span>
                <span className='subText'>{latestMessage}</span>
            </div>
        </Link>
    )
}

export default MessageCard