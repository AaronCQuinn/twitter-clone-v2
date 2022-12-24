import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';

const ProtectedRoute = () => {
    const [isAuth, setIsAuth] = useState();
    useEffect(() => {
        async function getAuth() {
            await fetch(`/api/user_authentication`)
            .then(res => {
                console.log(res.status);
                if (res.status === 401) {
                    setIsAuth(false);
                } else {
                    setIsAuth(true);
                }
            })
        }
        getAuth();
    }, [])
    console.log(isAuth);
    return isAuth ? <Outlet /> : <Navigate to='register' />;
};
  

export default ProtectedRoute