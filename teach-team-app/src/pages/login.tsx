import {Header} from "../components/Header/Header";
import {Footer} from "../components/Footer/Footer";

import "./login.css";

export default function loginScreen()
{
    return(
        <>
            <title>Login</title>
            <Header isLoggedIn={true} />
            <form className="login-form">
                <label>
                    Email:
                    <input type="text" name="email"/>
                </label>
                <label>
                    Password:
                    <input type="password" name="password"/>
                </label>

                <button></button>
            </form>
            <Footer isLoggedIn={true} type=""/>
        </>
    );
    
}