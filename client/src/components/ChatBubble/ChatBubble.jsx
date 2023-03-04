import React from 'react'
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import './chatbubble.css'

const ChatBubble = (fetchedChat) => {
    const { loggedInUser } = useContext(AuthContext);

    if (!fetchedChat) {
        return;
    }

    const { users } = fetchedChat.fetchedChat;
    const filteredUsers = users.filter(chatUser => chatUser._id !== loggedInUser._id);

    function renderImages(users) {
        const limitedUsers = users.slice(0, 3); // Slice the first 3 elements
        const renderedUsers = limitedUsers.map((user, index) => {
          return (
            <img
              key={index}
              src={user.profilePicture}
              alt={`Profile ${index}`}
            />
          );
        });
        return renderedUsers;
    }

    function renderCount() {
        if (filteredUsers.length > 3) {
            return filteredUsers.length - 3;
        }

        return filteredUsers.length;
    }
      

    return (
        <>
        <div className="chatImagesContainer">
            {
                renderImages(filteredUsers)
            }
        </div>

        <div className="userCount">
            {
                "+" + renderCount()
            }
        </div>
        </>
    )
}

export default ChatBubble