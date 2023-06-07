import React from 'react'
import { AuthContext } from '../../context/AuthContext';
import { useContext, useState } from 'react';
import './chatheader.css'
import ChatNameModal from '../Modals/ChatNameModal/ChatNameModal';

const ChatHeader = (fetchedChat) => {
    const { users, _id, chatName, isGroupChat } = fetchedChat.fetchedChat;

    let [chatNameModalShow, setChatNameModalShow] = useState(false);
    let [chatTitle, setChatTitle] = useState(chatName);
    const { loggedInUser } = useContext(AuthContext);

    if (!fetchedChat) {
        return;
    }
    
    const filteredUsers = users.filter(chatUser => chatUser._id !== loggedInUser._id);

    function renderOneOnOneDMImages(users) {
        return users.map((user, index) => {
            return (
                <img
                key={index}
                src={user.profilePicture}
                alt={`Profile ${index}`}
                />
            )
        })
    }

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
                {isGroupChat ? renderImages(filteredUsers): renderOneOnOneDMImages(users)}
            </div>

            {isGroupChat && <div className="userCount"> {"+" + renderCount()}</div>}
            
            <div className="chatTitle" onClick={() => setChatNameModalShow(true)}>
                { chatTitle ? chatTitle : users.length > 2 ? "Your group message." : "Your one-on-one message." }
            </div>
            <ChatNameModal modalShow={chatNameModalShow} setModalShow={setChatNameModalShow} id={_id} setChatTitle={setChatTitle} />
        </>
    )
}

export default ChatHeader