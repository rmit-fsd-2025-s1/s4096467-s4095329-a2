import { userService } from "@/services/api";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { LoadingScreen } from "@/components/Footer/LoadingScreen/LoadingScreen";

export default function Promote(){
    // Setting up Local storage email and password for identifications
    const[localEmail, setLocalEmail] = useState<string>("");
    const[localPassword, setLocalPassword] = useState<string>("");
    
    useEffect(() => 
    {
        setLocalEmail(localStorage.getItem("localEmail")||"");
    }, []);
    
    useEffect(() => 
    {
        setLocalPassword(localStorage.getItem("localPassword")||"");
    }, []);

    // Checking to see if the user's login is valid
    const [passwordValid, setPasswordValid] = useState<boolean>(false);
    useEffect(() => {
        const validatePassword = async () => {
            const isValid = await userService.validateLogin(localEmail, localPassword);
            setPasswordValid(isValid);
        };
        validatePassword();
    }, [localEmail, localPassword]);

    // Getting the user's role to change display depending on the role selected
    const [loginType, setLoginType] = useState<string>("");
    useEffect(() => {
        const getTypeVal = async () => {
            const type = await userService.getRole(localEmail)
            setLoginType(type);
        }
        getTypeVal();
    });


    return(<>
    <div className="main-container">
        <Header isLoggedIn={passwordValid} accountType={loginType}/>
        <main>
            { passwordValid ? "Valid Password": <LoadingScreen /> }
        </main>
        <Footer isLoggedIn={passwordValid} type={loginType}/>
    </div>
    </>);
}