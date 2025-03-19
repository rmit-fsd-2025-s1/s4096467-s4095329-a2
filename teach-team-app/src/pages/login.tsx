import {Header} from "../components/Header/Header";
import {Footer} from "../components/Footer/Footer";
import Link from 'next/link'

import "./sign-in.css";

export default function loginScreen()
{
    return(
        <>
            <title>Login</title>
            {/* <Header isLoggedIn={true} /> */}
            <form>
                <h1>Welcome to the TeachTeam</h1>
                <label>
                    Email
                    <input type="text" name="email"/>
                </label>
                <label>
                    Password
                    <input type="password" name="password"/>
                </label>
                <div className="forgot"/*Extra stuff*/> 
                    Forgot Password? 
                </div>
            <div className="flex-sbs flex-gap">
                <button>Sign In</button>
                <div className="ac">Don't have an Account?</div>
                <Link href="./register"><button>Register</button></Link>
            </div>
            </form>
            {/* <Footer isLoggedIn={true} type=""/> */}
        </>
    );
    
}