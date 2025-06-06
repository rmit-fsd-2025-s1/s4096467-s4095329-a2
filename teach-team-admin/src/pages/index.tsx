import {useState, FormEvent } from "react";
import {useRouter} from "next/navigation";
import Link from 'next/link';
import { Alert } from "@chakra-ui/react"
import { userService } from "@/services/api";

//Page loading for the login screen at /login
export default function LoginScreen()
{   
    //if false means invalid
    const [loginState, setLoginState] = useState(true);

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
        console.log(userService.validateLogin(email, password));

        //Redirect
        if(await userService.validateLogin(email, password))
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
                <div className="login-title">
                    <h1>Teach<span className="green">Team</span></h1>
                    <h2>Administration Page</h2>
                </div>
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