import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import React, { useContext } from 'react'
import { useEffect, useState } from 'react'
import { Container, Row, Col, Button, } from 'react-bootstrap/';
import Spinner from '../../components/Spinner/Spinner';
import UserCard from '../../components/UserCard/UserCard';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { showToast } from '../../components/Toast/showToast';
import UserSearchCard from '../../components/UserSearchCard/UserSearchCard';
import './inbox.css'
import { AuthContext } from '../../context/AuthContext';

const Inbox = () => {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false)
    const [searchResults, setSearchResults] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const params = useParams();
    const { loggedInUser } = useContext(AuthContext);

    useEffect(() => {
        document.title = 'Inbox ● Twitter';
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
        console.log('fired');
        if (selectedUsers.some((user) => user._id === item._id)) {
            return;
        }
        setSelectedUsers([...selectedUsers, item]);
    }
         
    return (
        <Container>
            <Row>
                <Col xs={2}>
                    <Navbar />
                </Col>

                <Col className="col-10 col-md-8 col-lg-6">
                    <div className="titleContainer">
                        <h1 className='titleContainerTitle'>{params.new ? 'New Message' : 'Inbox'}</h1>
                        <Link to={'/inbox/new'}>
                            <FontAwesomeIcon icon={faPlusSquare} />
                        </Link>
                    </div>

                    <div className="titleBarContainer">
                        <div className="chatTitleBar">
                            <label htmlFor="userSearchTextbox">To:</label>
                            <input type="text" name='userSearchTextBox' id='userSearchTextBox' className='userSearchTextbox' placeholder='Search your message history.' onChange={(e) => setInput(e.target.value)} />
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
                        <Button className='createChatButton' disabled={selectedUsers.length === 0}>Create Chat</Button>
                    </div>

                    {loading ? <Spinner />
                    :
                    searchResults ?
                    searchResults.map((item, index) => {
                        return <div onClick={() => handleAddUser(item)} key={index}><UserCard post={item} /></div>
                    })
                    : 
                    <div className='noResult'>
                        There are no results to show.
                    </div>
                    }

                </Col>

                <Col xs={2} className='d-none d-md-block col-md-2 col-lg-4'>
                    <span>third column</span>
                </Col>
            </Row>
        </Container>
)
}

export default Inbox