import React, {useContext} from 'react'
import { AuthContext } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDove, faHouseUser, faMagnifyingGlass, faBell, faUser, faEnvelope, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import './navbar.css'
import { NotificationContext } from '../../context/NotificationContext';

const Navbar = () => {
    const { handleLogout, loggedInUser } = useContext(AuthContext);
    const { getUnopenedDMNotificationCount, getUnopenedNotificationCount } = useContext(NotificationContext);

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
                <li className='navBarNotifications'>
                    <Link to='/notifications'>
                        {getUnopenedNotificationCount() > 0 && <span className='navBarNotifcationsIcon'>{getUnopenedNotificationCount()}</span>}
                        <FontAwesomeIcon icon={faBell} className='navbarLink'/>
                    </Link>
                </li>
                <li className='navBarNotifications'>
                    <Link to='/inbox' className='navBarNotifications'>
                        {getUnopenedDMNotificationCount() > 0 && <span className='navBarNotifcationsIcon'>{getUnopenedDMNotificationCount()}</span>}
                        <FontAwesomeIcon icon={faEnvelope} className='navbarLink' />
                    </Link>
                </li>
                <li>
                    <Link to={'/profile/' + loggedInUser._id + '/tweets'}>
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