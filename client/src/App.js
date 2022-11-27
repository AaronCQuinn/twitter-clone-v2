import React from 'react'
import Home from './pages/Home'
import { useEffect } from 'react';
import { checkLoginStatus } from './util/loginStatus';

function App() {
  useEffect(() => {
    checkLoginStatus();
  },[])

  return (
    <Home />
  )
}

export default App