import { Navigate, Outlet, useNavigate  } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const ProtectedRoute = () => {
    const navigate = useNavigate();
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const { dispatch } = useContext(AuthContext);

    useEffect(() => {
        setLoading(true);
        const getAuth = async() => {
            try {
                let res = await fetch(`/api/user_authentication`);

                // If user wasn't authenticated, send them to login.
                if (res.status === 401) {
                    navigate('/login');
                    return;
                }

                // User is authenticated.
                let data = await res.json();
                if (res.status === 200) { 
                    setIsAuth(true);
                    setLoading(false);
                    dispatch({ type: 'LOGIN', payload: data });
                };
            } catch(error) {
                console.log("Error trying to get authentication status: " + error);
            }
        }
        getAuth();
    }, [dispatch, navigate])

    if (loading) {
        return <></>; 
    } else {
        return isAuth ? <Outlet /> : <Navigate to='login' />;
    }
};
  

export default ProtectedRoute