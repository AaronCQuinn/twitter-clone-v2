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


function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route element={<ProtectedRoute />}>
            <Route path='/' element={<Home/>} />
            <Route path='/post/:id' element={<SinglePost/>} />
        </Route>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </>
  )
}

export default App