import React from 'react'
import { useEffect } from 'react'
import RegistrationForm from '../../components/RegistrationForm/RegistrationForm';

function Login() {
  useEffect(() => {
    document.title = "Login ● Twitter"
  }, []);

  return (

      <div className='wrapper'>
        <RegistrationForm />
      </div>

  )
}

export default Login