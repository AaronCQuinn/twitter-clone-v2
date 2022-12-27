import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDove, faHouseUser, faMagnifyingGlass, faBell, faUser, faEnvelope, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import {Col} from 'react-bootstrap/';
import './navbar.css'

const Navbar = () => {
  return (
    <Col xs={2} className='homeNav'>
        <Link to='/'>
            <FontAwesomeIcon icon={faDove} />
        </Link>
        <Link to='/'>
            <FontAwesomeIcon icon={faHouseUser} />
        </Link>
        <Link to='/search'>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
        </Link>
        <Link to='/notifications'>
            <FontAwesomeIcon icon={faBell} />
        </Link>
        <Link to='/messages'>
            <FontAwesomeIcon icon={faEnvelope} />
        </Link>
        <Link to='/profile'>
            <FontAwesomeIcon icon={faUser} />
        </Link>
        <Link to='/profile'>
            <FontAwesomeIcon icon={faSignOutAlt} />
        </Link>
    </Col>
  )
}

export default Navbar