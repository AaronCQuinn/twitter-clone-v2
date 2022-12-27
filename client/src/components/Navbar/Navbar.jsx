import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDove, faHouseUser, faMagnifyingGlass, faBell, faUser, faEnvelope, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import {Col} from 'react-bootstrap/';
import { useNavigate } from 'react-router-dom';
import './navbar.css'

const Navbar = ({ widthOption }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await fetch('/api/user_logout');
            navigate('/login');
        } catch(error) {
            
        }
    }
  return (
    <Col xs={widthOption} className='homeNav'>
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
        <FontAwesomeIcon icon={faSignOutAlt} className='homeNavAnchor' onClick={handleLogout} />
    </Col>
  )
}

export default Navbar