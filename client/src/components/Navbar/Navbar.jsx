import React, {useContext} from 'react'
import { AuthContext } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDove, faHouseUser, faMagnifyingGlass, faBell, faUser, faEnvelope, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import './navbar.css'

const Navbar = () => {
    const { handleLogout } = useContext(AuthContext);

    return (
        <nav className='navbar'>
            <ul>
                <li>
                    <Link to='/'>
                        <FontAwesomeIcon icon={faDove} className='navbarLink blue' />
                    </Link>
                </li>
                <li>
                    <Link to='/'>
                        <FontAwesomeIcon icon={faHouseUser} className='navbarLink' />
                    </Link>
                </li>
                    <Link to='/search/posts'>
                        <FontAwesomeIcon icon={faMagnifyingGlass} className='navbarLink' />
                    </Link>
                <li>
                    <Link to='/notifications'>
                        <FontAwesomeIcon icon={faBell} className='navbarLink' />
                    </Link>
                </li>
                    <Link to='/messages'>
                        <FontAwesomeIcon icon={faEnvelope} className='navbarLink' />
                    </Link>
                <li>
                    <Link to='/profile'>
                        <FontAwesomeIcon icon={faUser} className='navbarLink' />
                    </Link>
                </li>
                <li>
                    <FontAwesomeIcon icon={faSignOutAlt} className='navbarLink' onClick={handleLogout} />
                </li>
            </ul>
        </nav>
    )
}

export default Navbar