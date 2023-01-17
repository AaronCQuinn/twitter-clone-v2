import { useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './loginForm.css'
import { useContext } from 'react';

function LoginForm() {
    const { handleLogin, loginError } = useContext(AuthContext);
    const [formValues, setFormValues] = useState({
      loginUsername: "",
      loginPassword: ""
    });
    const [responseMessage, setResponseMessage] = useState();

    useEffect(() => {
      setResponseMessage(loginError);
    }, [loginError])

    const handleChange = (e) => {
      setFormValues({...formValues, [e.target.name]:e.target.value});
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      handleLogin(formValues);
      setFormValues({...formValues, loginPassword: ""});
      e.target.reset();
  }

  
    return (
    <div className="loginContainer">
      
      <h1>
        Login
      </h1>

      <form onSubmit={handleSubmit}>
        <input type="text" name="loginUsername" id="loginUsername" placeholder='Username or Email' value={formValues.loginUsername} onChange={handleChange} required/>
        <input type="password" name="loginPassword" id="loginPassword" placeholder='Password' value={formValues.loginPassword} onChange={handleChange} required/>
        <input type="submit" />
      </form>

      {responseMessage &&
        <div className={"registration-warning"}>
            {responseMessage}
      </div>}

      <a href="/register">Don't have an account? Register here.</a>

    </div>
    )
}

export default LoginForm