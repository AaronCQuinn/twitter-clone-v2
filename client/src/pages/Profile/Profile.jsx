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
import Tweet from '../../components/Tweet/Tweet';
import UserCard from '../../components/UserCard/UserCard';
import PageHeader from '../../components/PageHeader.jsx/PageHeader';

const Profile = () => {
    const params = useParams();
    const { userProfile, loading, getProfile, userProfilePosts, userProfileReplies, userProfileFollowing, userProfileFollowers} = useContext(ProfileContext);
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
                        <PageHeader title={userProfile.username}>
                        {(isSelected === 'following' || isSelected === 'followers' || !isSelected) &&
                            <Link to={'/profile/' + params.username + '/posts'}>
                                <FontAwesomeIcon icon={faArrowLeft} className='profileBackArrow' />
                            </Link>
                        }
                        </PageHeader>
        
                        {/* Profile Header */}
                        <ProfileHeader />

                        {/* Profile Tabs */}
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

                        {/* Profile Selection */}
 

                        {
                        isSelected === 'posts' ?

                            userProfilePosts.length === 0 ? 
                                <div className='noTweetError'>{userProfile.username} has no replies to show yet!</div>
                            :
                            userProfilePosts.map((post) => {
                                return <Tweet post={post} key={post._id} user={userProfile} />
                            })

                        :
                        isSelected === 'replies' ?

                            userProfileReplies.length === 0 ? 
                                <div className='noTweetError'>{userProfile.username} has no replies to show yet!</div>
                            :
                            userProfileReplies.map((post) => {
                                return <Tweet post={post} key={post._id} user={userProfile}/>
                            })

                        :
                        isSelected === 'followers' ?

                            userProfileFollowers.length === 0 ? 
                                <div className='noTweetError'>{userProfile.username} has no replies to show yet!</div>
                            :
                            userProfileFollowers.map((post) => {
                                return <UserCard post={post} key={post._id} />
                            })

                        :
                        isSelected === 'following' &&

                            userProfileFollowing.length === 0 ? 
                            <div className='noTweetError'>{userProfile.username} has no replies to show yet!</div>
                            :
                            userProfileFollowing.map((post) => {
                                return <UserCard post={post} key={post._id} />
                            })

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