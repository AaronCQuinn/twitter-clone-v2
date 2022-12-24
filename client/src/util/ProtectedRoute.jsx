import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const isAuth = false;
    // const isAuth = await axios({
    //     method: "get",
    //     url: `/api/user_authentication`
    // });
    // console.log(isAuth);
    return isAuth ? <Outlet /> : <Navigate to='register' />;
};
  

export default ProtectedRoute