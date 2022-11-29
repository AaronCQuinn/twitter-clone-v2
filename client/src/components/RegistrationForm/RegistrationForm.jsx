import React, {useState} from 'react'
import { useEffect } from 'react';
import './registrationForm.css'

function RegistrationForm() {
    const [passValue, setPassValue] = useState({
        registerPassword: "",
        registerPasswordConf: "",
    });
    const [validPass, setValidPass] = useState(false);

    useEffect(() => {
        const {registerPassword, registerPasswordConf} = passValue;
        if (registerPassword !== registerPasswordConf) {
            setValidPass(true);
        } else {
            setValidPass(false);
        }
    }, [passValue])


    const passChange = (e) => {
        const passString = e.target.value.trim();
        const passInput = {
            ...passValue, [e.target.name]:passString
        
        }
        setPassValue(passInput);
    };

    return (
    <div className="loginContainer">
          
        <h1>
          Register
        </h1>

        <form method="post">
            <input type="text" name="regFirstName" id="regFirstName" placeholder='First Name' required/>
            <input type="text" name="regLastName" id="regLastName" placeholder='Last Name' required/>
            <input type="text" name="regUsername" id="regUsername" placeholder='Username' required/>
            <input type="email" name="regEmail" id="regEmail" placeholder='Email' required/>
            <input type="password" name="registerPassword" id="registerPassword" placeholder='Password' onChange={passChange} required/>
            <input type="password" name="registerPasswordConf" id="registerPasswordConf" placeholder='Confirm Password' onChange={passChange} required/>
            {validPass &&
            <div className='password-warning'>
                The current passwords do not match!
            </div>
            }
            <input type="submit" value="Login" />
        </form>

        <a href="/login">Already have an account? Login here.</a>

    </div>
    )
}

export default RegistrationForm