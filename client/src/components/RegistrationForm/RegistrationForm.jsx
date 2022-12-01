import React, {useState} from 'react'
import { useEffect } from 'react';
import './registrationForm.css'
import axios from 'axios'

function RegistrationForm() {
    const [formValues, setFormValues] = useState({
        regFirstName: "",
        regLastName: "",
        regUsername: "",
        regEmail: "",
        registerPassword: "",
        registerPasswordConf: "",
    });
    const [matchPass, setMatchPass] = useState(false);
    const [validPass, setValidPass] = useState(false);

    useEffect(() => {
        const {registerPassword, registerPasswordConf} = formValues;

        function checkPassword(str) {
            const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
            return re.test(str);
        }

        if (registerPassword !== registerPasswordConf) {
            setMatchPass(true);
        } else {
            setMatchPass(false);
        }

        if (checkPassword(registerPassword)) {
            setValidPass(true);
        } else {
            setValidPass(false);
        }
    }, [formValues])


    const handleChange = (e) => {
        setFormValues({...formValues, [e.target.name]:e.target.value});
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        axios.post('/api/user_registration', { formValues },
            {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            })
            .then(res => {
                console.log(res);
            })
            .catch(error => {
                console.log(`Error posting to back end: ${error}`);
        })
    }

    return (
    <div className="loginContainer">
          
        <h1>
          Register
        </h1>

        <form onSubmit={handleSubmit}>
            <input type="text" name="regFirstName" id="regFirstName" placeholder='First Name' onChange={handleChange} required/>
            <input type="text" name="regLastName" id="regLastName" placeholder='Last Name' onChange={handleChange} required/>
            <input type="text" name="regUsername" id="regUsername" placeholder='Username' onChange={handleChange} required/>
            <input type="email" name="regEmail" id="regEmail" placeholder='Email' onChange={handleChange} required/>
            <input type="password" name="registerPassword" id="registerPassword" placeholder='Password' onChange={handleChange} required/>
            <input type="password" name="registerPasswordConf" id="registerPasswordConf" placeholder='Confirm Password' onChange={handleChange} required/>
            {matchPass &&
            <div className='password-warning'>
                The current passwords do not match!
            </div>
            }
            {validPass &&
            <div className='password-warning'>
                Your password must be a minimum of 8 characters with an upper and lowercase character, as well as a number and symbol.
            </div>
            }
            <input type="submit" value="Login" />
        </form>

        <a href="/login">Already have an account? Login here.</a>

    </div>
    )
}

export default RegistrationForm