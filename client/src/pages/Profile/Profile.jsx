import React from 'react'
import { useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap/';
import Navbar from '../../components/Navbar/Navbar';
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext';
import ProfileHeader from '../../components/ProfileHeader/ProfileHeader';
import ProfileBioButtons from '../../components/ProfileBioSection/ProfileBioButtons';
import ProfileBioDetails from '../../components/ProfileBioDetails/ProfileBioDetails';
import ProfileBioTabs from '../../components/ProfileBioTabs/ProfileBioTabs';


const Profile = () => {
    const { state } = useContext(AuthContext);

    useEffect(() => {
        document.title = `${state.user.username + ' ● Twitter'}`;
    }, [state.user.username])

    return (
        <>
        <Container>
            <Row>
                <Navbar widthOption={2}/>
                {/* The main section gets more room once the screen hits the different breakpoints. */}
                <Col className={"mainSectionContainer col-10 col-md-8 col-lg-6"}>
                    <div className="titleContainer">
                        <h1 className='titleContainerTitle'>{state.user.username}</h1>
                    </div>

                    {/* Profile Header */}
                    <ProfileHeader user={state.user} />
                    <ProfileBioButtons user={state.user} />
                    <ProfileBioDetails user={state.user} />
                    <ProfileBioTabs user={state.user}/>

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