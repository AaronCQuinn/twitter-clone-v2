import { createContext, useState } from "react"
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [loggedInUser, setLoggedInUser] = useState({});
    const [loginError, setLoginError] = useState();
    const navigate = useNavigate();
    
    const handleLogin = async (formValues) => {
        try {
            const response = await axios.post('/api/user_login', formValues, {
            headers: { 'Content-Type': 'application/json' }})
            if (response.status) {
                setLoggedInUser(response.data)
                navigate('/');
                return;
            }
       
        } catch(error) {
            switch (error.response.status) {
                case 404:
                    setLoginError("No user found which matched those credentials.");
                    break;
                case 401:
                    setLoginError("No user found which matched those credentials.")
                    break;
                case 500:
                    setLoginError('There was a server error. Please try again.')
                    break;
                case 400:
                    setLoginError("All fields must be submitted with a valid value in order to login.")
                    break;
                default:
                    break;
            }
        }
    }

    const handleLogout = async () => {
        try {
            await fetch('/api/user_logout');
            navigate('/login');
        } catch(error) {
            console.log(error);
        }
    }

    return (
        <AuthContext.Provider value={{loggedInUser, handleLogin, loginError, handleLogout, setLoggedInUser}}>
            { children }
        </AuthContext.Provider>
    )
}
