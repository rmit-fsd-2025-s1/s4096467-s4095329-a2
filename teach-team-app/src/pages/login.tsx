import {Header} from "../components/Header/Header";
import {Footer} from "../components/Footer/Footer";
import {useState, FormEvent} from "react";
import {useRouter} from "next/navigation";
import { isPasswordValid, userState, getPasswordForUser } from "../helpers/validate";
import Link from 'next/link'

import "./sign-in.css";



;

export default function loginScreen()
{
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
        const userVal: userState = {email, password};
        console.log(isPasswordValid(userVal));

        //Redirect
        if(isPasswordValid(userVal))
        {
            router.push('/educator/educator');
        }
        else
        {
            //Password is invalid
        }
    }

    return(
        <>  
            <div className="video-background">
                <video src="/test1.mp4" autoPlay loop muted playsInline />
            </div>
            <title>Login</title>
            {/* <Header isLoggedIn={true} /> */}
            <form onSubmit={attemptLogin}>
                <h1>Welcome to the TeachTeam</h1>
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
                    />
                </label>
                <div className="forgot"/*Extra stuff*/> 
                    Forgot Password? 
                </div>
            <div className="flex-sbs flex-gap">
                <button className="login">Sign In</button>
                <div className="ac">Don't have an Account?</div>
                <Link href="./register"><button className="register">Register</button></Link>
            </div>
            </form>
            {/* <Footer isLoggedIn={true} type=""/> */}
        </>
    );
    
}