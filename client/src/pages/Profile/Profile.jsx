import React from 'react'
import { useContext } from 'react'
import { Container, Row, Col } from 'react-bootstrap/';
import Navbar from '../../components/Navbar/Navbar';
import ProfileHeader from '../../components/ProfileComponents/ProfileHeader/ProfileHeader';
import { useParams, Link } from 'react-router-dom';
import Spinner from '../../components/Spinner/Spinner';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ProfileContext } from '../../context/ProfileContext';
import { useEffect, useState } from 'react';

const Profile = () => {
    const params = useParams();
    const { userProfile, loading, getProfile } = useContext(ProfileContext);
    const [isSelected, setIsSelected] = useState(params.option);

    useEffect(() => {
        getProfile(params.username);
        // eslint-disable-next-line
    }, [params.username])

    useEffect(() => {
        setIsSelected(params.option);
    }, [params.option])

    return (
        <Container>
            <Row>
                <Col xs={2}>
                    <Navbar />
                </Col>

                <Col className={"mainSectionContainer"}>
                    {loading ? <Spinner /> :
                    <>
                        <div className="titleContainer">
                            {(isSelected === 'following' || isSelected === 'followers' || !isSelected) &&
                                <Link to={'/profile/' + params.username + '/posts'}>
                                    <FontAwesomeIcon icon={faArrowLeft} className='profileBackArrow' />
                                </Link>
                            }
                            <h1 className='titleContainerTitle'>{userProfile.username}</h1>
                        </div>
        
                        {/* Profile Header */}
                        <ProfileHeader />

                        {isSelected === "posts" || isSelected === 'replies' || !isSelected ? 
                            <div className="tabsContainer">
                                <span className={`tab ${isSelected === 'posts' && 'active'}`} onClick={() => setIsSelected('posts')}>
                                    Posts
                                </span>
                                <span className={`tab ${isSelected === 'replies' && 'active'}`} onClick={() => setIsSelected('replies')}>
                                    Replies
                                </span>
                            </div>
                        :
                            <div className="tabsContainer">
                                <span className={`tab ${isSelected === 'following' && 'active'}`} onClick={() => setIsSelected('following')}>
                                    Following
                                </span>
                                <span className={`tab ${isSelected === 'followers' && 'active'}`} onClick={() => setIsSelected('followers')}>
                                    Followers
                                </span>
                            </div>
                        }
                    </>
                }
                </Col>

                <Col xs={2} className='d-none d-md-block col-md-2 col-lg-4'>
                    <span>third column</span>
                </Col>
            </Row>
        </Container>
    )
}

export default Profile