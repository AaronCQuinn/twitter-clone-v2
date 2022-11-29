import React, {useState} from 'react'

function RegistrationForm() {
    const [passValue, setPassValue] = useState({
        password: "",
        passwordConf: "",
    });
    const [validPass, setValidPass] = useState(false);

    const passMatch = () => {
        if (passValue.password === passValue.passwordConf) {
            setValidPass(true);
        } else {
            setValidPass(false);
        }
    }

    const passChange = (e) => {
        if (e.target.name === "registerPassword") {
            setPassValue({...passValue, password: e.target.value});
        } else {
            setPassValue({...passValue, passwordConf: e.target.value})
        }

        passMatch();
        console.log(passValue)
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
            <input type="password" name="registerPasswordConf" id="registerPasswordConf" placeholder='Password' onChange={passChange} required/>
            <input type="submit" value="Login" />
        </form>

        <a href="/login">Already have an account? Login here.</a>

    </div>
    )
}

export default RegistrationForm