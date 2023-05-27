import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { showToast } from '../Toast/showToast';
import { useNavigate } from 'react-router-dom';
import UserSearchCard from '../../components/UserSearchCard/UserSearchCard';
import Spinner from '../../components/Spinner/Spinner';
import UserCard from '../../components/UserCard/UserCard';
import { Button } from 'react-bootstrap';

const MessageCreation = () => {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const { loggedInUser } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Create Message ● Twitter';
    }, []);

    useEffect(() => {
        if (input) {
            setLoading(true);
            const timer = setTimeout(() => {
                handleSearch(input);
            }, 1000);
            
            return () => {
                clearInterval(timer);
                setLoading(false);
            }
        } else {
            setSearchResults();
        }
        // eslint-disable-next-line
    }, [input])

    const handleSearch = async (value) => {
        try {
            const search = await fetch(`/api/search/users/?term=${encodeURIComponent(value)}`);
            if (search.ok) {
                let searchData = await search.json();
                const filteredData = searchData.filter((user) => user._id !== loggedInUser._id && !selectedUsers.some(selectedUser => selectedUser._id === user._id));
                setSearchResults(filteredData);
            } else {
                throw new Error();
            }
        } catch(error) {
            console.log(error);
            showToast('An error occured while trying to complete the search.', 'error');
        } finally {
            setLoading(false);
        }
    }

    const handleAddUser = (item) => {
        if (selectedUsers.length >= 10) {
            return;
        }

        if (selectedUsers.some((user) => user._id === item._id)) {
            return;
        }
        setSelectedUsers([...selectedUsers, item]);
    }

    const handleCreateChatClick = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`/api/chats/create_dm`, {selectedUsers}, { headers: { 'Content-Type': 'application/json' }})
            const chat = response.data;
            console.log(chat);

            if (!chat || !chat._id) {
                throw new Error();
            }

            navigate(`/inbox/${chat._id}`);
        } catch (error) {
            console.error(error);
            showToast('error', 'There was an error creating the chat. Please try again.')
        }
    }

    return (
    <>
        <div className="titleBarContainer">
            <div className="chatTitleBar">
                <input type="text" name='userSearchTextBox' id='userSearchTextBox' className='userSearchTextbox' placeholder='Search for users to message.' onChange={(e) => setInput(e.target.value)} />
            </div>
            <div className="selectedUserContainer">
                {selectedUsers.map((item) => {
                    return <UserSearchCard
                    key={item._id}
                    item={item}
                    selectedUsers={selectedUsers}
                    setSelectedUsers={setSelectedUsers}
                    />
                })}
            </div>
            <Button className='createChatButton' disabled={selectedUsers.length === 0} onClick={handleCreateChatClick}>Create Chat</Button>
        </div>

        {loading 
        ? <Spinner />
        : searchResults ?
        searchResults.map((item, index) => {
            return <div onClick={() => handleAddUser(item)} key={index}><UserCard post={item} /></div>
        })
        : 
        <div className='noResult'>
            There are no results to show.
        </div>
        }
    </>
    )
}

export default MessageCreation