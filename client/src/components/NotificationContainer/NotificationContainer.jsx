import React from 'react'
import { Link } from 'react-router-dom';

const NotificationContainer = ({ notifications }) => {
    const isEmpty = notifications.length > 0 ? false : true;

    if (isEmpty) {
        return (
            <div className='noResults'>You have no notifications to display.</div>
        )
    }

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

    return (
        notifications.map(notification => {
            const { userFrom, notificationType } = notification;

            return (
                <Link key={notification._id} className='resultListItem notification'>
                    <div className='resultsImageContainer'>
                        <img src={userFrom.profilePicture} alt="User sending notification" />
                    </div>
                    <div className='resultsDetailsContainer ellipsis'>
                        <span className='ellipsis'>{renderNotificationText(notificationType, userFrom)}</span>
                    </div>
                </Link>
            )
        })
    )
}

export default NotificationContainer