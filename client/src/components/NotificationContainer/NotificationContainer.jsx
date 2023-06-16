import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import './notificationContainer.css'
import MarkAllOpenHeader from './MarkAllOpenHeader/MarkAllOpenHeader';
import Spinner from '../../components/Spinner/Spinner'
import { NotificationContext } from '../../context/NotificationContext';

const NotificationContainer = () => {
    const { notifications, loading, markNotificationOpen } = useContext(NotificationContext);

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

    const isEmpty = notifications.length > 0 ? false : true;
    return (
        loading ? <Spinner /> :
        <>
        <MarkAllOpenHeader />
        {isEmpty ? <div className='noResult'>You have no notifications to display.</div> :
        
        notifications.map(notification => {
            const { userFrom, notificationType, entityId, opened, _id: notificationId } = notification;
            
            return (
                <Link to={renderNotificationLink(notificationType, entityId)} key={notification._id} className={`resultListItem notification ${!opened ? 'active' : ''}`} 
                onClick={() => opened ? null : markNotificationOpen(notificationId)}>
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