import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect ,useContext} from 'react';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
    const navigate = useNavigate();
    const [isAuth, setIsAuth] = useState(false);
    const {setLoggedInUser} = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
            getAuth();
            // eslint-disable-next-line
    }, [navigate])

    const getAuth = async() => {
        setLoading(true);
        try {
            let res = await fetch(`/api/user_authentication`);
            // If user wasn't authenticated, send them to login.
            if (res.status === 401) {
                navigate('/login');
                return;
            }

            // User is authenticated.
            if (res.status === 200) { 
                let data = await res.json();
                setIsAuth(true);
                setLoggedInUser(data);
                setLoading(false);
            };

        } catch(error) {
            console.log("Error trying to get authentication status: " + error);
        }
        setLoading(false);
    }

    if (loading) {
        return <Outlet/>;
    } else {
        return isAuth ? <Outlet /> : <Navigate to='/login' />;
    }
};
  

export default ProtectedRoute