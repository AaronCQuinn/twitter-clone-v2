import React, { useEffect } from 'react'
import ChatBubble from '../../components/ChatBubble/ChatBubble';
import typingGif from './typing2.gif'
import { useRef } from 'react';

const ChatMessages = ({ messageArray, isTyping }) => {
    const chatMessagesRef = useRef(null);

    useEffect(() => {
        chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }, [messageArray, isTyping])
    
    return (
        <ul className="chatMessages" ref={chatMessagesRef}>
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
            {
                isTyping && <img src={typingGif} className='typingGif' alt="" />
            }
        </ul>
    )
}

export default ChatMessages