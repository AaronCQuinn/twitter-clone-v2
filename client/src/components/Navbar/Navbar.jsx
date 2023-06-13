import React, {useContext} from 'react'
import { AuthContext } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDove, faHouseUser, faMagnifyingGlass, faBell, faUser, faEnvelope, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import './navbar.css'
import { NotificationContext } from '../../context/NotificationContext';

const Navbar = () => {
    const { handleLogout, loggedInUser } = useContext(AuthContext);
    const { notifications, dmNotifications } = useContext(NotificationContext);

    const notificationCount = notifications.reduce((acc, obj) => obj['opened'] === false ? acc + 1 : acc, 0);
    const dmNotificationCount = dmNotifications.reduce((acc, obj) => obj['opened'] === false ? acc + 1 : acc, 0);

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
                        {notificationCount > 0 && <span className='navBarNotifcationsIcon'>{notificationCount}</span>}
                        <FontAwesomeIcon icon={faBell} className='navbarLink'/>
                    </Link>
                </li>
                <li className='navBarNotifications'>
                    <Link to='/inbox' className='navBarNotifications'>
                        {dmNotificationCount > 0 && <span className='navBarNotifcationsIcon'>{dmNotificationCount}</span>}
                        <FontAwesomeIcon icon={faEnvelope} className='navbarLink' />
                    </Link>
                </li>
                <li>
                    <Link to={'/profile/' + loggedInUser.username + '/posts'}>
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