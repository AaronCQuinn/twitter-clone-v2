import React from 'react'
import './loginForm.css'

function LoginForm() {

    return (
    <div className="loginContainer">
          
          <h1>
            Login
          </h1>

          <form method="post">
            <input type="text" name="loginUsername" id="loginUsername" placeholder='Username or Email' required/>
            <input type="password" name="loginPassword" id="loginPassword" placeholder='Password' required/>
            <input type="submit" value="Login" />
          </form>

          <a href="/register">Don't have an account? Register here.</a>

    </div>
    )
}

export default LoginForm