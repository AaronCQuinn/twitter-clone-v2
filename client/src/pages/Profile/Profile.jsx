import React from 'react'
import { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap/';
import Navbar from '../../components/Navbar/Navbar';
import Posts from '../../components/Posts/Posts';
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';
import ProfileHeader from '../../components/ProfileHeader/ProfileHeader';

const Profile = () => {
    const { state } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState();
    const { username } = useParams();

    const getProfile = async(username) => {
        setLoading(true);
        try {
            let res = await fetch(`/api/profile/${username}`);
            let data = await res.json();
            console.log(data);
            setProfile(data);
            setLoading(false);
        } catch(error) {
            console.log("Error trying to get profile from the database: " + error);
        }
    }

    useEffect(() => {
        getProfile(username);
    }, [username])

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
                        <h1 className='titleContainerTitle'>{username}</h1>
                    </div>
                    <ProfileHeader user={state.user} />
                    <Posts user={state.user} />
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