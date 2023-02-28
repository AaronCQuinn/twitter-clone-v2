import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import './messagecard.css'

const MessageCard = ({ chat }) => {
    const { loggedInUser } = useContext(AuthContext);
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

    const renderChatImageElement = (users) => {
        const otherChatUser = otherChatUsers(users);
        let chatImage = [users[0].profilePicture];

        if (otherChatUser.length > 1) {
            chatImage.push(users[1].profilePicture);
        }

        return (
            <div className={`resultsImageContainer ${otherChatUser.length > 1 && 'groupChatImage'}`}>
                {
                chatImage.map((item, index) => {
                    return <img src={item} alt="" key={index} />
                })
                }
            </div>
        );
    }

    return (
        <Link to={`/inbox/${chat._id}`} className='resultListItem'>
            {renderChatImageElement(chat.users)}
            <div className='resultsDetailsContainer ellipsis'>
                <span className='heading ellipsis'>{setChatName()}</span>
                <span className='subText ellipsis'>{latestMessage}</span>
            </div>
        </Link>
    )
}

export default MessageCard