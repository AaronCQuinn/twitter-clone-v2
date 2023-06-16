import React from 'react';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Search from './pages/Search/Search';
import Inbox from './pages/Inbox/Inbox';
import {
  Route,
  Routes
} from 'react-router-dom';
import ProtectedRoute from './util/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SinglePost from './pages/SinglePost/SinglePost';
import Profile from './pages/Profile/Profile';
import { AuthContextProvider } from './context/AuthContext';
import { ProfileContextProvider } from './context/ProfileContext';
import './app.css'
import Chat from './pages/Chat/Chat';
import { SocketContextProvider } from './context/SocketContext';
import Notifications from './pages/Notifications/Notifications';
import { NotificationContextProvider } from './context/NotificationContext';

function App() {

  return (
    <AuthContextProvider>
      <SocketContextProvider>
      <ProfileContextProvider>
      <NotificationContextProvider>

      <ToastContainer />

      <Routes>
        <Route element={<ProtectedRoute />}>
            <Route path='/' element={<Home/>} />
            <Route path='/post/:id' element={<SinglePost/>} />
            <Route path='/profile/:profileId' element={<Profile />} />
            <Route path='/profile/:profileId/:option' element={<Profile/>} />
            <Route path='/search/' element={<Search/>} />
            <Route path='/search/:option' element={<Search/>} />
            <Route path='/inbox' element={<Inbox />} />
            <Route path='/inbox/:chatId' element={<Chat />} />
            <Route path='/notifications' element={<Notifications />} />
        </Route>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
      </Routes>
      
      </NotificationContextProvider>
      </ProfileContextProvider>
      </SocketContextProvider>
    </AuthContextProvider>
  )
}

export default App