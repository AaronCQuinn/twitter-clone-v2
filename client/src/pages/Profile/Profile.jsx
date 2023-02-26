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
import PageHeader from '../../components/PageHeader/PageHeader';

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

    const renderSwitch = (isSelected) => {

        const errorText = (text) => {
            return <div className='noTweetError'>{userProfile.username} has no {text} to show yet!</div>;
        }

        switch (isSelected) {
            case 'posts':
                if (!userProfilePosts) return errorText(isSelected);
                return userProfilePosts.map((post) => {
                    return <Tweet post={post} key={post._id} user={userProfile} />
                })

                case 'replies':
                    if (!userProfileReplies) return errorText(isSelected);
                    return userProfileReplies.map((post) => {
                        return <Tweet post={post} key={post._id} user={userProfile}/>
                    })

                case 'followers':
                    if (!userProfileFollowers) return errorText(isSelected);
                    return userProfileFollowers.map((post) => {
                        return <UserCard post={post} key={post._id} />
                    });
            
                case 'following':
                    if (!userProfileFollowing) return errorText(isSelected);
                    return userProfileFollowing.map((post) => {
                        return <UserCard post={post} key={post._id} />
                    })
          
            default:
              return <div className='noTweetError'>An error happened when getting the user's information. Please try again.</div>;
        }          
    }

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
 
                        {renderSwitch(isSelected)}
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