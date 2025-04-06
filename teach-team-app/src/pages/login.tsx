import {Header} from "../components/Header/Header";
import {Footer} from "../components/Footer/Footer";
import {useState, FormEvent, useEffect} from "react";
import {useRouter} from "next/navigation";
import { isPasswordValid, userCred, getPasswordForUser } from "../helpers/validate";
import Link from 'next/link';
import { Alert } from "@chakra-ui/react"

import "./sign-in.css";
import { TbFlagSearch } from "react-icons/tb";
import { hadUnsupportedValue } from "next/dist/build/analysis/get-page-static-info";

//Page loading for the login screen at /login
export default function loginScreen()
{   
    //if false means invalid
    const [loginState, setLoginState] = useState(true);
    //A password is strong enough ie 1+ Uppercase, 1+ Special char, 12+ chars
    //True if strong, false if weak
    const [strength, setStrength] = useState(true);
    const [passCheck, setPassCheck] = useState({
        length: 0,
        hasUpper: false,
        hasSymbol: false,
        hasLetter: false,
    });

    //Gets localStorage for localEmail, if it is not set, get ""
    useEffect(() => {
        const localEmail = localStorage.getItem("localEmail")||"";
      }, []);

    //Gets localStorage for localPassword, if it is not set, get ""
    useEffect(() => {
      const localPassword = localStorage.getItem("localPassword")||"";
    }, []);

    //Create form data using state hook
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    
    //Create router for redirecting on successful login
    const router = useRouter();
    
    //Attempt to login on submit
    const attemptLogin = (e: FormEvent) => 
    {
        e.preventDefault();

        console.log(formData);
        const email = formData.email;
        const password = formData.password;
        const userVal: userCred = {email, password};
        console.log(isPasswordValid(userVal));
        
        //Source https://onecompiler.com/questions/3xnp9df38/-javascript-how-to-check-for-special-characters-present-in-a-string
        let specialChars = /[\\|,.<>\/?~ `!@#$%^&*(){}_\-+=:;"'\[\]]/;
        let letters = /[a-zA-Z]/;
        //Returns true if containing letters etc.
        let hasLetter = letters.test(password);
        let hasUpper = /[A-Z]/.test(password);
        let hasSymbol = specialChars.test(password);
        let length = password.length;
        setPassCheck({ length, hasUpper, hasSymbol, hasLetter });

        const isStrong = length >= 12 && hasSymbol && hasUpper && hasLetter;
        setStrength(isStrong);

        //Redirect
        if(isPasswordValid(userVal))
        {
            localStorage.setItem("localEmail", email);
            localStorage.setItem("localPassword", password);
            router.push('/educator/educator');
        }
        else
        {   
            setLoginState(false);
        }
    }

    return(
        <>  
            <div className="video-background">
                <video src="/test2.mp4" autoPlay loop muted playsInline/>
            </div>
            {/* <title>Login</title> */}
            {/* <Header isLoggedIn={true} /> */}
            <form onSubmit={attemptLogin}>
                <div className="login-title"><h1>Teach<span className="green">Team</span></h1></div>
                <label>
                    Email
                    {/* On Update, set the values in formData for email */}
                    <input type="text" name="email"
                        value={formData.email}
                        onChange={(e)=>setFormData({...formData, email: e.target.value})}
                        placeholder="Enter Email"
                    />
                </label>
                <label>
                    Password
                    {/* On Update, set the values in formData for password */}
                    <input type="password" name="password"
                        value={formData.password}
                        onChange={(e)=>setFormData({...formData, password: e.target.value})}
                        placeholder="Enter Password"
                    />
                </label>

                {!loginState ? (
                  <Alert.Root status="error">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>Invalid Username or Password. Please try again.</Alert.Title>
                    <Alert.Description />
                  </Alert.Content>
                </Alert.Root>
                ) : "" }
                
                {!strength ? ( //In the actual register implementation prevent the user from registering
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

                <div className="forgot"/*Extra stuff*/> 
                    <Link href="">Forgot Password?</Link> 
                </div>
            <div className="flex-sbs flex-gap">
                <button className="login">Sign In</button>
                <div className="ac">──────────── New to TeachTeam? ────────────</div>
                <Link href="./register"><button className="register">Register</button></Link>
            </div>
            </form>
            {/* <Footer isLoggedIn={true} type=""/> */}
        </>
    );
    
}