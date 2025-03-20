import {Header} from "../components/Header/Header";
import {Footer} from "../components/Footer/Footer";
import Link from 'next/link'

import "./sign-in.css";

export default function registerScreen()
{
    return(
        <>
            <div className="video-background">
                <video src="/test1.mp4" autoPlay loop muted playsInline />
            </div>
            <title>Login</title>
            {/* <Header isLoggedIn={true} /> */}
            <form className="login-form">
            <h1>Create an Account</h1>
                <label>
                    Email
                    <input type="text" name="email"/>
                </label>
                <label>
                    Password
                    <input type="password" name="password"/>
                </label>
                <label>
                    Confirm Password
                    <input type="password" name="password"/>
                </label>
            <div className="flex-sbs flex-gap">
                <a href="./register"><button className="login">Register</button></a>
                <Link href="./login"><button className="register">Back to login</button></Link>
            </div>
            </form>
            {/* <Footer isLoggedIn={true} type=""/> */}
        </>
    );
    
}