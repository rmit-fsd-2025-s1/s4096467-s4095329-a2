import {Header} from "../../components/Header/Header";
import {Footer} from "../../components/Footer/Footer";
import {HomeContent} from "../../components/Home/Home";
import { isPasswordValid, userCred, getPasswordForUser, getUserType} from "../../helpers/validate";

import "../../styles/user-home.css";
import { useEffect, useState } from "react";

//some function to get username form their email before character '@';

export default function loginScreen()
{
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

    let user: userCred = {email: localEmail, password:localPassword};
    let passwordValid = isPasswordValid(user);
    let loginType = getUserType(user.email);

    return(
        <>
            <title>Lecturer Home</title>
            <Header isLoggedIn={passwordValid} accountType={loginType}/>
            <h1>Hi, {user.email} you are a {loginType}</h1>
            <img src = "/userpfp.png" height="500px" width="500px"></img>
            <Footer isLoggedIn={passwordValid} type=""/>
        </>
    );
    
}
