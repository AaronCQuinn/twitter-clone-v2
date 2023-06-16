import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import io from 'socket.io-client';

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const { loggedInUser } = useContext(AuthContext);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io('http://localhost:5001');
        newSocket.emit('setup', loggedInUser._id);
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        }
    }, [loggedInUser._id]);

    function emitNotification(userId) {
        if (userId === loggedInUser) return;

        console.log('sent from client');
        socket.emit('notification received', userId);
    }

    return (
        <SocketContext.Provider value={{socket, emitNotification}}>
            { children }
        </SocketContext.Provider>
    )
}