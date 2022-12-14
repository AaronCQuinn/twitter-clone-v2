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

    const [matchPass, setMatchPass] = useState(true);
    const [validPass, setValidPass] = useState(true);

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


    const handleChange = (e) => {
        setFormValues({...formValues, [e.target.name]:e.target.value});
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        axios.post('/api/user_registration', { formValues },
            {
            headers: {
                'Content-Type': 'application/json'
              }
            })
            .then(res => {
                console.log(res.data.payload);
            })
            .catch(error => {
                console.log(`Error posting to back end: ${error}`);
        });
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
            <div className='password-warning'>
                The current passwords do not match!
            </div>
            }
            {!validPass &&
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