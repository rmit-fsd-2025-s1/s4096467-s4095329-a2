import {Header} from "../components/Header/Header";
import {Footer} from "../components/Footer/Footer";
import Link from 'next/link'

import "./sign-in.css";

export default function loginScreen()
{
    return(
        <>
            <title>Login</title>
            <Header isLoggedIn={true} />
            <form>
                <label>
                    Email:
                    <input type="text" name="email"/>
                </label>
                <label>
                    Password:
                    <input type="password" name="password"/>
                </label>
            <div className="flex-sbs flex-gap">
                <button>Log In</button>
                <Link href="./register"><button>Register</button></Link>
            </div>
            </form>
            <Footer isLoggedIn={true} type=""/>
        </>
    );
    
}