import React from 'react'
import { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap/';
import Navbar from '../../components/Navbar/Navbar';
import ProfileHeader from '../../components/ProfileHeader/ProfileHeader';
import ProfileBioButtons from '../../components/ProfileBioButtons/ProfileBioButtons';
import ProfileBioDetails from '../../components/ProfileBioDetails/ProfileBioDetails';
import ProfileBioTabs from '../../components/ProfileBioTabs/ProfileBioTabs';
import { useParams } from 'react-router-dom';
import Spinner from '../../components/Spinner/Spinner';

const Profile = () => {

    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState();
    const { username } = useParams();

    const getProfile = async() => {
        setLoading(true);
        try {
            let res = await fetch(`/api/profile/${username}`);
            let data = await res.json();
            setProfileData(data);
            document.title = `${data.twitterUser.username + ' ● Twitter'}`;
            setLoading(false);
        } catch(error) {
            console.log("Error trying to get profile from the database: " + error);
        }
    }

    useEffect(() => {
        getProfile();
        // eslint-disable-next-line
    }, [username])

    return (
        <>
        <Container>
            <Row>
                <Navbar widthOption={2}/>
                {/* The main section gets more room once the screen hits the different breakpoints. */}
                <Col className={"mainSectionContainer col-10 col-md-8 col-lg-6"}>
                    {loading ? <Spinner />
                    :
                    
                    <>
                        <div className="titleContainer">
                            <h1 className='titleContainerTitle'>{profileData.twitterUser.username}</h1>
                        </div>
        
                        {/* Profile Header */}
                        <ProfileHeader user={profileData.twitterUser} />
                        <ProfileBioButtons profileData={profileData.twitterUser} />
                        <ProfileBioDetails user={profileData.twitterUser} />
                        <ProfileBioTabs user={profileData.twitterUser}/>
                    </>
                    }

                </Col>

                <Col xs={2} className='d-none d-md-block col-md-2 col-lg-4'>
                    <span>third column</span>
                </Col>
            </Row>
        </Container>
        </>
    )
}

export default Profile