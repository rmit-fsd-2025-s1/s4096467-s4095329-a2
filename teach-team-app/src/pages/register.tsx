import { verify } from 'crypto';
import Link from 'next/link'
import { useState, useEffect, FormEvent } from "react";
import { PiCoinsBold } from 'react-icons/pi';
import { userApi } from '../services/api';
import { registerUser } from '../helpers/registerAcc'
import { Alert } from "@chakra-ui/react"
export default function RegisterScreen()
{
    //Self notes
    //Flow RegisterScreen -> registerUser(frontend) -> userApi(frontend) -> router.post(backend) -> controller(backend) -> frontend result
    //You gotta make sure the values align with your table in user tables
    const [newUser, setNewUser] = useState({
        email: "",
        password: "",
        //constant role idk what to do with roles yet so imma make it tutor. probs need to do something with it later.
        role: "tutor",
    })

    //A password is strong enough ie 1+ Uppercase, 1+ Special char, 12+ chars
    //True if strong, false if weak
    const [strength, setStrength] = useState(true);
    const [passCheck, setPassCheck] = useState({
        length: 0,
        hasUpper: false,
        hasSymbol: false,
        hasLetter: false,
    });

    const [verifyPassword, setPassword] = useState({
        password: "",
    })

    //bruh true if same false if not
    const [same, setSame] = useState(true)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)

    const registerUserButton = async (e: FormEvent) => {
        e.preventDefault();

        //Source https://onecompiler.com/questions/3xnp9df38/-javascript-how-to-check-for-special-characters-present-in-a-string
        const specialChars = /[\\|,.<>\/?~ `!@#$%^&*(){}_\-+=:;"'\[\]]/;
        const letters = /[a-zA-Z]/;
        //Returns true if containing letters etc.
        const hasLetter = letters.test(newUser.password);
        const hasUpper = /[A-Z]/.test(newUser.password);
        const hasSymbol = specialChars.test(newUser.password);
        const length = newUser.password.length;
        setPassCheck({ length, hasUpper, hasSymbol, hasLetter });
        const isStrong = length >= 12 && hasSymbol && hasUpper && hasLetter;
        setStrength(isStrong);

        if(verifyPassword.password === newUser.password){
            setSame(true)
            if(isStrong) { 
                const state = await registerUser(newUser);
                setSuccess(state);
                setError(false)
                console.log(state)
                if (!state) {
                    setError(true);
                }
            }
        }
        else {
            setSame(false);
        }
    }
    
    return(
        <>
            <div className="video-background">
                <video src="/test2.mp4" autoPlay loop muted playsInline />
            </div>
            <title>Login</title>
            <form onSubmit={registerUserButton} className="login-form">
            <h2>Create an Account</h2>
                <label>
                    Email
                    <input type="email" 
                        value={newUser.email}
                        onChange={(e) => 
                            setNewUser({ ...newUser, email: e.target.value})
                        }                        
                    name="email"
                    placeholder="Enter Email"
                    required
                    />
                </label>
                <label>
                    Password
                    <input type="password" 
                        value={newUser.password}
                        onChange={(e) => 
                            setNewUser({ ...newUser, password: e.target.value})
                        }                        
                    name="password"
                    placeholder="Enter Password"
                    required
                    />
                </label>
                <label>
                    Confirm Password
                    <input type="password" 
                        placeholder="Retype Password"
                        value={verifyPassword.password}
                        onChange={(e) => 
                            setPassword({ ...verifyPassword, password: e.target.value})
                        }                    
                    />                    
                </label>

                {!strength ? ( 
                  <Alert.Root status="warning">
                  <Alert.Indicator />
                  <Alert.Content>
                        {passCheck.length < 12 && (<Alert.Title>Password must contain at least 12 Characters</Alert.Title>)}
                        {!passCheck.hasLetter && (<Alert.Title>Password must contain at least 1 Letter</Alert.Title>)}
                        {!passCheck.hasUpper && (<Alert.Title>Password must contain at least 1 Uppercase</Alert.Title>)}
                        {!passCheck.hasSymbol && (<Alert.Title>Password must contain at least 1 Special Character</Alert.Title>)}
                    <Alert.Description />
                  </Alert.Content>
                </Alert.Root>
                ) : "" }

                {!same ? ( 
                  <Alert.Root status="error">
                  <Alert.Indicator />
                  <Alert.Content>
                        <Alert.Title>Your passwords are not the same</Alert.Title>
                    <Alert.Description />
                  </Alert.Content>
                </Alert.Root>
                ) : "" }

                {success ? ( 
                  <Alert.Root status="success">
                  <Alert.Indicator />
                  <Alert.Content>
                        <Alert.Title>Sucessfully Registered!</Alert.Title>
                        <Alert.Title>Please head to the login page to continue</Alert.Title>
                    <Alert.Description />
                  </Alert.Content>
                </Alert.Root>
                ) : ""}

                {error ? ( 
                  <Alert.Root status="error">
                  <Alert.Indicator />
                  <Alert.Content>
                        <Alert.Title>Error with Registration</Alert.Title>
                        <Alert.Title>Email may already be registered. Try another email</Alert.Title>
                    <Alert.Description />
                  </Alert.Content>
                </Alert.Root>
                ) : ""}


            <div className="flex-sbs flex-gap">
                {/* if password === confirm password */}
                <button className="login">Register</button>
                <div className="adjust-pos">
                    <Link href="./login"><button className="register">Back to login</button></Link>
                </div>
            </div>
            </form>
        </>
    );
}