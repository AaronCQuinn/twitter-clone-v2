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
            <FontAwesomeIcon icon={faDove} className='homeNavAnchor blue' />
        </Link>
        <Link to='/'>
            <FontAwesomeIcon icon={faHouseUser} className='homeNavAnchor' />
        </Link>
        <Link to='/search'>
            <FontAwesomeIcon icon={faMagnifyingGlass} className='homeNavAnchor' />
        </Link>
        <Link to='/notifications'>
            <FontAwesomeIcon icon={faBell} className='homeNavAnchor' />
        </Link>
        <Link to='/messages'>
            <FontAwesomeIcon icon={faEnvelope} className='homeNavAnchor' />
        </Link>
        <Link to='/profile'>
            <FontAwesomeIcon icon={faUser} className='homeNavAnchor' />
        </Link>
        <Link to='/profile'>
            <FontAwesomeIcon icon={faSignOutAlt} className='homeNavAnchor' />
        </Link>
    </Col>
  )
}

export default Navbar