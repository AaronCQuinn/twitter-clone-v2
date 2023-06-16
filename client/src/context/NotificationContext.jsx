import axios from "axios";
import { createContext, useState, useEffect, useContext } from "react"
import { showToast } from "../components/Toast/showToast";
import { SocketContext } from "./SocketContext";

export const NotificationContext = createContext();

export const NotificationContextProvider = ({ children }) => {
    const { socket } = useContext(SocketContext);
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
        } catch {}
    
        setLoading(false);
    };

    const fetchLatestNotification = async() => {
      try {
        const latestNotification = await axios.get('/api/notifications/latest');
        console.log(latestNotification);
        setNotifications(prev => [latestNotification.data, ...prev]);
      } catch(error) {
        showToast(
          'An error occurred while fetching your notifications. Please try again.',
          'error'
        );
      }
    }
      
    const markAllNotificationsOpen = async() => {
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

    const markNotificationOpen = async(notificationId) => {
        try {
            await axios.put('/api/notifications/mark-open', { notificationId })
        } catch(error) {
            showToast('An error occured while updating your notifications.', 'error')
        }
    }

    function getUnopenedNotificationCount() {
      return notifications.reduce((acc, obj) => obj['opened'] === false ? acc + 1 : acc, 0);
    }

    function getUnopenedDMNotificationCount() {
      return dmNotifications.reduce((acc, obj) => obj['opened'] === false ? acc + 1 : acc, 0);
    }

    const markAllDMNotificationsOpen = () => {
        const updatedDMNotifications = dmNotifications.map(notification => ({
          ...notification,
          opened: true,
        }));
        setDMNotifications(updatedDMNotifications);
    }

    useEffect(() => {
      if (socket) {
            socket.on('notification received', () => {
              fetchLatestNotification();
            }
          )
          
          return () => {
              socket.off('notification received');
          }
      }
  }, [socket])
    
    useEffect(() => {
        fetchNotifications();
    }, [])

    return (
        <NotificationContext.Provider value={{ notifications, setNotifications, loading, markAllNotificationsOpen, markNotificationOpen, dmNotifications, markAllDMNotificationsOpen, getUnopenedDMNotificationCount, getUnopenedNotificationCount }}>
            { children }
        </NotificationContext.Provider>
    )
}
