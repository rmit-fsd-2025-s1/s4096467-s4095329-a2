import Link from 'next/link'

import "./sign-in.css";

export default function registerScreen()
{
    return(
        <>
            <div className="video-background">
                <video src="/test2.mp4" autoPlay loop muted playsInline />
            </div>
            <title>Login</title>
            <form className="login-form">
            <h2>Create an Account</h2>
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
                <Link href="./register"><button className="login">Register</button></Link>
                <div className="adjust-pos">
                    <Link href="./login"><button className="register">Back to login</button></Link>
                </div>
            </div>
            </form>
        </>
    );
    
}