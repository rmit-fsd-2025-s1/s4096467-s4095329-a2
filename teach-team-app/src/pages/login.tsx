import {useState, FormEvent } from "react";
import {useRouter} from "next/navigation";
import { isPasswordValid, userCred } from "../helpers/validate";
import Link from 'next/link';
import { Alert } from "@chakra-ui/react"

//Page loading for the login screen at /login
export default function LoginScreen()
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

    //Create form data using state hook
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    
    //Create router for redirecting on successful login
    const Router = useRouter();
    
    //Attempt to login on submit
    const attemptLogin = async (e: FormEvent) => 
    {
        e.preventDefault();

        console.log(formData);
        const email = formData.email;
        const password = formData.password;
        const userVal: userCred = {email, password};
        console.log(isPasswordValid(userVal));
        
        //Source https://onecompiler.com/questions/3xnp9df38/-javascript-how-to-check-for-special-characters-present-in-a-string
        const specialChars = /[\\|,.<>\/?~ `!@#$%^&*(){}_\-+=:;"'\[\]]/;
        const letters = /[a-zA-Z]/;
        //Returns true if containing letters etc.
        const hasLetter = letters.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasSymbol = specialChars.test(password);
        const length = password.length;
        setPassCheck({ length, hasUpper, hasSymbol, hasLetter });

        const isStrong = length >= 12 && hasSymbol && hasUpper && hasLetter;
        setStrength(isStrong);

        //Redirect
        if(await isPasswordValid(userVal))
        {
            localStorage.setItem("localEmail", email);
            localStorage.setItem("localPassword", password);
            Router.push('/educator/educator');
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