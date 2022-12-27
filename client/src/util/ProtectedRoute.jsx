import { Navigate, Outlet  } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const ProtectedRoute = () => {
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const { dispatch } = useContext(AuthContext);

    useEffect(() => {
        setLoading(true);
        const getAuth = async() => {
            try {
                let res = await fetch(`/api/user_authentication`);
                let data = await res.json();

                setLoading(false);
                if (res.status === 200) { 
                    setIsAuth(true);
                    dispatch({ type: 'LOGIN', payload: data });
                };
            } catch(error) {
                console.log("Error trying to get authentication status: " + error);
            }
        }
        getAuth();
    }, [dispatch])

    if (loading) {
        return <></>; 
    } else {
        return isAuth ? <Outlet /> : <Navigate to='login' />;
    }
};
  

export default ProtectedRoute