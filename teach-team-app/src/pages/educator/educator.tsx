import {Header} from "../../components/Header/Header";
import {Footer} from "../../components/Footer/Footer";
import {HomeContent} from "../../components/Home/Home";
import { isPasswordValid, userCred, getPasswordForUser, getUserType} from "../../helpers/validate";

import "../../styles/user-home.css";
import { useEffect, useState } from "react";

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

    return(
        <>
            <title>Lecturer Home</title>
            <Header isLoggedIn={passwordValid} />
            <HomeContent isLoggedIn={passwordValid} accountType={getUserType(localEmail)||""}/>
            <Footer isLoggedIn={passwordValid} type=""/>
        </>
    );
    
}
