import React, {useState} from 'react'
import { useEffect } from 'react';
import './registrationForm.css'
import axios from 'axios'
import { hasValue } from '../../util/hasValue';

function RegistrationForm() {
    const [formValues, setFormValues] = useState({
        regFirstName: "",
        regLastName: "",
        regUsername: "",
        regEmail: "",
        registerPassword: "",
        registerPasswordConf: "",
    });

    const [matchPass, setMatchPass] = useState(true);
    const [validPass, setValidPass] = useState(true);
    const [serverResponse, setServerResponse] = useState();
    const [responseMessage, setResponseMessage] = useState({
        message: "",
        statusColor: ""
    });

    useEffect(() => {
        function checkPassword(str) {
            const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
            return re.test(str);
        }

        if (formValues.registerPassword !== formValues.registerPasswordConf) {
            setMatchPass(false);
        } else {
            setMatchPass(true);
        }

        if (checkPassword(formValues.registerPassword) || formValues.registerPassword === "" || formValues.registerPasswordConf === "") {
            setValidPass(true);
        } else {
            setValidPass(false);
        }
    }, [formValues])

    useEffect(() => {
        let message;
        let statusColor;
        
        if (serverResponse !== 201) {
            statusColor = 'warning'
        } else {
            statusColor = 'success'
        }

        switch (serverResponse) {
            case 201:
                message = "Your new account was successfully registered.";
                break;
            case 409:
                message = "There is already a user registered under this username or email.";
                break;
            case 500:
                message = 'There was a server error. Please try again.';
                break;
            case 400:
                message = "All fields must be submitted with a valid value in order to register.";
                break;
            default:
                break;
        }

        setResponseMessage({
            message,
            statusColor
        })
    }, [serverResponse])


    const handleChange = (e) => {
        if (hasValue(serverResponse)) {
            setServerResponse();
        }
        setFormValues({...formValues, [e.target.name]:e.target.value});
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        axios.post('/api/user_registration', formValues,
            {
            headers: {
                'Content-Type': 'application/json'
              }
            })
            .then(res => {
                console.log(res);
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
        setFormValues({...formValues, registerPassword: "", registerPasswordConf: ""});
        e.target.reset();
    }


    return (
    <div className="loginContainer">
          
        <h1>
          Register
        </h1>

        <form onSubmit={handleSubmit}>
            <input type="text" name="regFirstName" id="regFirstName" placeholder='First Name' value={formValues.regFirstName} onChange={handleChange} required/>
            <input type="text" name="regLastName" id="regLastName" placeholder='Last Name' value={formValues.regLastName} onChange={handleChange} required/>
            <input type="text" name="regUsername" id="regUsername" placeholder='Username' value={formValues.regUsername} onChange={handleChange} required/>
            <input type="email" name="regEmail" id="regEmail" placeholder='Email' value={formValues.regEmail} onChange={handleChange} />
            <input type="password" name="registerPassword" id="registerPassword" placeholder='Password' onChange={handleChange} required/>
            <input type="password" name="registerPasswordConf" id="registerPasswordConf" placeholder='Confirm Password' onChange={handleChange} required/>
            {!matchPass &&
            <div className="registration-warning">
                The current passwords do not match!
            </div>
            }
            {!validPass &&
            <div className='registration-warning'>
                Your password must be a minimum of 8 characters with an upper and lowercase character, as well as a number and symbol.
            </div>
            }
            {responseMessage.message &&
            <div className={"registration-" + responseMessage.statusColor}>
                {responseMessage.message}
            </div>    
            }
            <input type="submit" value="Login" />
        </form>

        <a href="/login">Already have an account? Login here.</a>

    </div>
    )
}

export default RegistrationForm