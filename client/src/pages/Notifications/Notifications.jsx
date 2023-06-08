import React, { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader'
import Navbar from '../../components/Navbar/Navbar'
import { Container, Col, Row } from 'react-bootstrap'
import axios from 'axios'
import NotificationContainer from '../../components/NotificationContainer/NotificationContainer';
import Spinner from '../../components/Spinner/Spinner'

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async() => {
        setLoading(true);
        try {
            const userNotifications = await axios.get('/api/notifications/get_notifications');
            setNotifications(() => userNotifications.data);
        } catch(error) {
            console.log(error);
        }

        setLoading(false);
    }

    useEffect(() => {
        fetchNotifications();
    }, [])

    return (
        <Container>
                <Row>
                    <Col xs={2}> <Navbar /> </Col>

                    <Col className="mainSectionContainer"> 
                        <PageHeader title={'Notifications'} /> 
                        {loading ? <Spinner /> : <NotificationContainer notifications={notifications} />}
                    </Col>

                    <Col xs={2} className='d-none d-md-block col-md-2 col-lg-4'> <span>third column</span> </Col>
                </Row>
            </Container>
    )
}

export default Notifications