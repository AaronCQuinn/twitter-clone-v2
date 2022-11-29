import React from 'react'
import Home from './pages/Home'
import Login from './pages/Login/Login';
import Register from './pages/Register/Register'
import { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import { checkLoginStatus } from './util/loginStatus';

function App() {
  const [userAuth, setUserAuth] = useState(false);
  useEffect(() => {
    checkLoginStatus();
  },[])

  return (
    <Register />
  )
}

export default App