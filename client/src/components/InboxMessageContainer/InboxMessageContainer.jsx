import React, {useState, useEffect} from 'react'
import { showToast } from '../Toast/showToast';
import MessageCard from '../MessageCard/MessageCard';
import Spinner from '../Spinner/Spinner';

const InboxMessageContainer = () => {
    const [chats, setChats] = useState([]);
    const [filteredChats, setFilteredChats] = useState([]);
    const [input, setInput] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMessages();
    }, [])

    useEffect(() => {
        setFilteredChats(chats.filter(chat => {
            const { chatName, users } = chat;
            const userNames = users.map(user => `${user.firstName} ${user.lastName}`);
            
            if (chatName) {
                return (chatName.toLowerCase().includes(input.toLowerCase()));
            }
            
            return userNames.some(userName =>
                userName.toLowerCase().includes(input.toLowerCase())
            );
        }));              
        //eslint-disable-next-line
    }, [input])
    
    const getMessages = async() => {
        setLoading(true);
        try {
            const response = await fetch('/api/chats/fetch_dms');
            if (response.ok) {
                const messages = await response.json();
                setChats(messages);
            }
        } catch(error) {
            console.log(error);
            showToast('error', 'There was an error getting your messages. Please try again.')
        } finally {
            setLoading(false);
        }
    }

    let chatArrayToRender = input ? filteredChats : chats;

    return (
        <>
        <div className="titleBarContainer">
            <div className="chatTitleBar">
                <input type="text" name='userSearchTextBox' id='userSearchTextBox' className='userSearchTextbox' placeholder='Filter your message history by search for users included in your chats.' onChange={(e) => setInput(e.target.value)} />
            </div>
        </div>

        {loading ? <Spinner /> : chatArrayToRender.map(chat => { return <MessageCard chat={chat} key={chat._id} /> }) }
        </>
    )
}

export default InboxMessageContainer