import { Navigate, Outlet  } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ProtectedRoute = () => {
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        const getAuth = async() => {
            try {
                const res = await fetch(`/api/user_authentication`);
                setLoading(false);
                if (res.status === 200) { setIsAuth(true) } ;
            } catch(error) {
                console.log("Error trying to get authentication status: " + error);
            }
        }
        getAuth();
    }, [])

    if (loading) {
        return <></>; 
    } else {
        return isAuth ? <Outlet /> : <Navigate to='login' />;
    }
};
  

export default ProtectedRoute