import React from 'react'
import { useEffect, useState, useContext } from 'react'
import { Container, Row, Col } from 'react-bootstrap/';
import Navbar from '../../components/Navbar/Navbar';
import PageHeader from '../../components/PageHeader.jsx/PageHeader';
import { useParams } from 'react-router-dom';
import SearchBar from '../../components/SearchBar/SearchBar';
import Spinner from '../../components/Spinner/Spinner';
import Tweet from '../../components/Tweet/Tweet'
import { AuthContext } from '../../context/AuthContext';
import UserCard from '../../components/UserCard/UserCard';

function Home() {
    const [isSelected, setIsSelected] = useState('posts');
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState();
    const params = useParams();
    const { loggedInUser } = useContext(AuthContext);

    useEffect(() => {
        document.title = 'Search ● Twitter';
        params.option ? setIsSelected(params.option) : setIsSelected('posts');
    }, [params.option]);

    return (
        <Container>
            <Row>
                <Col xs={2}>
                    <Navbar />
                </Col>

                <Col className="col-10 col-md-8 col-lg-6">
                    <PageHeader title="Search" />

                    <SearchBar setLoading={setLoading} setSearchResults={setSearchResults} isSelected={isSelected}/>

                    <div className="tabsContainer">
                        <span className={`tab ${isSelected === 'posts' && 'active'}`} onClick={() => setIsSelected('posts')}>
                            Posts
                        </span>
                        <span className={`tab ${isSelected === 'users' && 'active'}`} onClick={() => setIsSelected('users')}>
                            Users
                        </span>
                    </div>

                    {loading ? <Spinner />
                    :
                    searchResults ?
                        isSelected === 'posts' ?
                        searchResults.map((item, index) => {
                            return <Tweet post={item} user={loggedInUser} key={index} />
                        })
                        :
                        searchResults.map((item, index) => {
                            return <UserCard post={item} key={index} />
                        })
                    : ''
                    }

                </Col>

                <Col xs={2} className='d-none d-md-block col-md-2 col-lg-4'>
                    <span>third column</span>
                </Col>
            </Row>
        </Container>
    )
}

export default Home