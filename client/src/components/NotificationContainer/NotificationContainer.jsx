import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import './notificationContainer.css'
import MarkAllOpenHeader from './MarkAllOpenHeader/MarkAllOpenHeader';
import axios from 'axios'
import Spinner from '../../components/Spinner/Spinner'
import { showToast } from '../../components/Toast/showToast';

const NotificationContainer = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async() => {
        setLoading(true);
        try {
            const userNotifications = await axios.get('/api/notifications');
            setNotifications(() => userNotifications.data);
        } catch(error) {
            console.log(error);
        }

        setLoading(false);
    }

    useEffect(() => {
        fetchNotifications();
    }, [])

    function renderNotificationText(notificationType, userSendingNotification) {
        const { firstName, lastName } = userSendingNotification;
        let returnString = `${firstName + ' ' + lastName} has`;

        switch(notificationType) {
            case 'like':
                returnString += ' liked your tweet.'
                break;
            case 'reply':
                returnString += ' replied to your tweet.'
                break;
            case 'retweet':
                returnString += ' retweeted your tweet.'
                break;
            case 'follow':
                returnString += ' followed you.'
                break;        
            default:
                break;
        }

        return returnString;
    }

    function renderNotificationLink(notificationType, entityId) {
        const TWEET_NOTIFICATIONS = ['retweet', 'like', 'reply'];
        const isTweetRelated = TWEET_NOTIFICATIONS.includes(notificationType);
        
        if (isTweetRelated) {
            return `/post/${entityId}`
        }

        const PROFILE_NOTIFICATIONS = ['follow'];
        const isProfileRelated = PROFILE_NOTIFICATIONS.includes(notificationType);

        if (isProfileRelated) {
            return `/profile/${entityId}/posts`
        }

        return '#';
    }

    const handleMarkAllOpenClick = async() => {
        const notificationIdArray = notifications.map(notification => notification._id);
        try {
            await axios.put('/api/notifications/mark-all-open', notificationIdArray);
            const updatedNotifications = notifications.map(notification => ({
                ...notification,
                opened: true,
            }));
            setNotifications(updatedNotifications);
        } catch(error) {
            showToast('An error occured while updating your notifications.', 'error')
        }
    }

    const handleNotificationClick = async(notificationId) => {
        try {
            await axios.put('/api/notifications/mark-open', { notificationId })
        } catch(error) {
            showToast('An error occured while updating your notifications.', 'error')
        }
    }

    const isEmpty = notifications.length > 0 ? false : true;
    return (
        loading ? <Spinner /> :
        <>
        <MarkAllOpenHeader notifications={notifications} handleMarkAllOpenClick={handleMarkAllOpenClick}/>
        {isEmpty ? <div className='noResults'>You have no notifications to display.</div> :
        
        notifications.map(notification => {
            const { userFrom, notificationType, entityId, opened, _id: notificationId } = notification;
            
            return (
                <Link to={renderNotificationLink(notificationType, entityId)} key={notification._id} className={`resultListItem notification ${!opened ? 'active' : ''}`} onClick={() => handleNotificationClick(notificationId)}>
                    <div className='resultsImageContainer'>
                        <img src={userFrom.profilePicture} alt="User sending notification" />
                    </div>
                    <div className='resultsDetailsContainer ellipsis'>
                        <span className='ellipsis'>{renderNotificationText(notificationType, userFrom)}</span>
                    </div>
                </Link>
            )
        })
    }
        </>
    )
}

export default NotificationContainer