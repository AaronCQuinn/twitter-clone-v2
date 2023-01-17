import React from 'react'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login';
import Register from './pages/Register/Register'
import {
  Route,
  Routes
} from 'react-router-dom';
import ProtectedRoute from './util/ProtectedRoute';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import SinglePost from './pages/SinglePost/SinglePost';
import Profile from './pages/Profile/Profile';
import { AuthContextProvider } from './context/AuthContext';
import { ProfileContextProvider } from './context/ProfileContext';
import './app.css'

function App() {
  return (
    <AuthContextProvider>
      <ProfileContextProvider>
      <ToastContainer />

      <Routes>
        <Route element={<ProtectedRoute />}>
            <Route path='/' element={<Home/>} />
            <Route path='/post/:id' element={<SinglePost/>} />
            <Route path='/profile/:username' element={<Profile />} />
            <Route path='/profile/:username/:option' element={<Profile/>} />
        </Route>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
      </Routes>

      </ProfileContextProvider>
    </AuthContextProvider>
  )
}

export default App