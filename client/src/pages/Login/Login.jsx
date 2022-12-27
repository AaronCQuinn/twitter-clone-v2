import React from 'react'
import { useEffect } from 'react'
import './login.css'
import LoginForm from '../../components/LoginForm/LoginForm';

function Login() {
  useEffect(() => {
    document.title = "Login ● Twitter"
  }, []);

  return (
      <div className='wrapper'>
        <LoginForm />
      </div>
  )
}

export default Login