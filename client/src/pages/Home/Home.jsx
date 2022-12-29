import React from 'react'
import { useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap/';
import Navbar from '../../components/Navbar/Navbar';
import Content from '../../components/Content/Content';

function Home() {
    useEffect(() => {
        document.title = 'Home ● Twitter';
    }, [])

    return (
        <Container>
            <Row>
                <Navbar widthOption={2}/>
                {/* The main section gets more room once the screen hits the different breakpoints. */}
                <Content widthOption={"col-10 col-md-8 col-lg-6"} />

                <Col xs={2} className='d-none d-md-block col-md-2 col-lg-4'>
                    <span>third column</span>
                </Col>
            </Row>
        </Container>
    )
}

export default Home