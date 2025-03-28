import {Header} from "../components/Header/Header";
import {Footer} from "../components/Footer/Footer";
import {useState, FormEvent, useEffect} from "react";
import {useRouter} from "next/navigation";
import { isPasswordValid, userCred, getPasswordForUser } from "../helpers/validate";
import Link from 'next/link';
import { Alert } from "@chakra-ui/react"

import "./sign-in.css";
import { TbFlagSearch } from "react-icons/tb";

//Page loading for the login screen at /login
export default function loginScreen()
{   
    //if false means invalid
    const [loginState, setLoginState] = useState(true);

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
                <h1>Teach<span className="green">Team</span></h1>
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

                {!loginState ? ( //TODO FIx this ui issue
                  <Alert.Root status="error">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>Invalid Username or Password. Please try again.</Alert.Title>
                    <Alert.Description />
                  </Alert.Content>
                </Alert.Root>
                ) : null }

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