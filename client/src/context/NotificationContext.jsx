import axios from "axios";
import { createContext, useState, useEffect } from "react"
import { showToast } from "../components/Toast/showToast";

export const NotificationContext = createContext();

export const NotificationContextProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [dmNotifications, setDMNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const fetchNotifications = async () => {
        setLoading(true);
        try {
          const notificationResponse = await axios.get('/api/notifications');
          const { data } = notificationResponse;
          const { notifications, dmNotifications } = data.reduce(
            (acc, notification) => {
                const { notificationType } = notification;
              if (notificationType !== 'message') {
                acc.notifications.push(notification);
              } else {
                acc.dmNotifications.push(notification);
              }
              return acc;
            },
            { notifications: [], dmNotifications: [] }
          );
      
          setNotifications(notifications);
          setDMNotifications(dmNotifications);
        } catch (error) {
          showToast(
            'An error occurred while fetching your notifications. Please try again.',
            'error'
          );
        }
    
        setLoading(false);
    };
      
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

    const updateDmNotifications = () => {
      console.log('invoked');
        const updatedDMNotifications = dmNotifications.map(notification => ({
          ...notification,
          opened: true,
        }));
        setDMNotifications(updatedDMNotifications);
    }
    
    useEffect(() => {
        fetchNotifications();
    }, [])

    return (
        <NotificationContext.Provider value={{ notifications, setNotifications, loading, handleMarkAllOpenClick, handleNotificationClick, dmNotifications, updateDmNotifications }}>
            { children }
        </NotificationContext.Provider>
    )
}
