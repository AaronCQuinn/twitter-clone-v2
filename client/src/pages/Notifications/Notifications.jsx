import React from 'react'
import PageHeader from '../../components/PageHeader/PageHeader'
import Navbar from '../../components/Navbar/Navbar'
import { Container, Col, Row } from 'react-bootstrap'

const Notifications = () => {


  return (
    <Container>
            <Row>
                <Col xs={2}>
                    <Navbar />
                </Col>

                <Col className={"mainSectionContainer"}>
                    <PageHeader title={'Notifications'} />

                </Col>

                <Col xs={2} className='d-none d-md-block col-md-2 col-lg-4'>
                    <span>third column</span>
                </Col>
            </Row>
        </Container>
  )
}

export default Notifications