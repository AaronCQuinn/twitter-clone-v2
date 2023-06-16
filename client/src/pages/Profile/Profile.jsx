import React from 'react'
import { useContext } from 'react'
import { Container, Row, Col } from 'react-bootstrap/';
import Navbar from '../../components/Navbar/Navbar';
import ProfileHeader from '../../components/ProfileComponents/ProfileHeader/ProfileHeader';
import { useParams,  } from 'react-router-dom';
import Spinner from '../../components/Spinner/Spinner';
import { ProfileContext } from '../../context/ProfileContext';
import { useEffect, useState } from 'react';
import Tweet from '../../components/Tweet/Tweet';
import UserCard from '../../components/UserCard/UserCard';
import PageHeader from '../../components/PageHeader/PageHeader';
import ProfileReturnArrow from '../../components/ProfileComponents/ProfileReturnArrow/ProfileReturnArrow';

const Profile = () => {
    const params = useParams();
    const { profile, loading, fetchProfile, profileTweets, profileReplies, profileFollowing, profileFollowers } = useContext(ProfileContext);
    const [isSelected, setIsSelected] = useState(params.option);

    const RENDER_OPTIONS = {
        'tweets': profileTweets,
        'replies': profileReplies,
        'following': profileFollowing,
        'followers': profileFollowers,
    }

    useEffect(() => {
        fetchProfile(params.profileId);
    }, [params.profileId])

    useEffect(() => {
        setIsSelected(params.option);
    }, [params.option])

    const renderSwitch = () => {
        const errorText = (text) => {
            return <div className='noTweetError'>{profile.username} has no {text} to show yet!</div>;
        }

        if (RENDER_OPTIONS[isSelected].length === 0) {
            return errorText(isSelected);
        }

        return RENDER_OPTIONS[isSelected].map((post) => {
            const returnElement = isSelected.includes('follow') ? <UserCard post={post} key={post._id} /> : <Tweet post={post} key={post._id} user={profile} />
            return returnElement;
        })   
    }

    const renderTabs = () => {
        const TAB_RENDER_OPTIONS = isSelected.includes('follow') ? { 'following': profileFollowing,'followers': profileFollowers } : {'tweets': profileTweets,
        'replies': profileReplies};

        return Object.keys(TAB_RENDER_OPTIONS).map(key => {
            return <span key={key} className={`tab ${key === isSelected && 'active'}`} onClick={() => setIsSelected(key)}>
                {key}
            </span>
        })
    }
    
    return (
        <Container>
            <Row>
                <Col xs={2}>
                    <Navbar />
                </Col>

                <Col className="mainSectionContainer">
                {loading ? <Spinner /> : 
                    <>
                        <PageHeader title={profile.username}>
                            {isSelected.includes('follow') && <ProfileReturnArrow profileId={params.profileId} />}
                        </PageHeader>
        
                        <ProfileHeader profile={profile}/>

                        <div className='tabsContainer'>
                            {renderTabs()}
                        </div>

                        {renderSwitch()}
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