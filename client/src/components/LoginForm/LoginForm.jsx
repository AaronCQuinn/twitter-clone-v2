import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hasValue } from '../../util/hasValue';
import axios from 'axios';
import './loginForm.css'

function LoginForm() {
    const [formValues, setFormValues] = useState({
      loginUsername: "",
      loginPassword: ""
    });
    const [serverResponse, setServerResponse] = useState();
    const [responseMessage, setResponseMessage] = useState();
    const navigate = useNavigate();

    useEffect(() => {
      let message;

      if (serverResponse === 201) {
          return navigate('/');
      } 
      
      switch (serverResponse) {
          case 404:
              message = "No user found which matched those credentials.";
              break;
          case 401:
              message = "No user found which matched those credentials.";
              break;
          case 500:
              message = 'There was a server error. Please try again.';
              break;
          case 400:
              message = "All fields must be submitted with a valid value in order to login.";
              break;
          default:
              break;
      }

      setResponseMessage(message)
    }, [serverResponse, navigate])

    const handleChange = (e) => {
      if (hasValue(serverResponse)) {
          setServerResponse();
      }
      setFormValues({...formValues, [e.target.name]:e.target.value});
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      axios.post('/api/user_login', formValues,
          {
          headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(res => {
              setServerResponse(res.status);
          })              
          .catch(error => {
              setServerResponse(error.response.status)
              console.log(`Error posting to back end: ${error}`);
          })
      .catch(error => {
          console.log(error.response.data);
          console.log(`Axios request failed: ${error}`);
      })
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