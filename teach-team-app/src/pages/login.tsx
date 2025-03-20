import {Header} from "../components/Header/Header";
import {Footer} from "../components/Footer/Footer";
import Link from 'next/link'

import "./sign-in.css";

export default function loginScreen()
{
    return(
        <>  
            <div className="video-background">
                <video src="/test2.mp4" autoPlay loop muted playsInline />
            </div>
            {/* <title>Login</title> */}
            {/* <Header isLoggedIn={true} /> */}
            <form>
                <h1>Teach<span className="green">Team</span></h1>
                <label>
                    Email
                    <input type="text" name="email"/>
                </label>
                <label>
                    Password
                    <input type="password" name="password"/>
                </label>
                <div className="forgot"/*Extra stuff*/> 
                    <Link href="./login">Forgot Password?</Link> 
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