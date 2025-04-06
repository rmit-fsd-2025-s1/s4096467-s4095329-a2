import {Header} from "../../components/Header/Header";
import {Footer} from "../../components/Footer/Footer";
import {HomeContent} from "../../components/Home/Home";
import { isPasswordValid, userCred, getPasswordForUser, getUserType, getName} from "../../helpers/validate";

import "../../styles/user-home.css";
import { useEffect, useState} from "react";
import Link from "next/link";

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
    let name = getName(user.email);

    return(
        <>
            <title>Lecturer Home</title>
            <Header isLoggedIn={passwordValid} accountType={loginType}/>
            {/* if a lecturer then show courses  */}
            {loginType === "lecturer" ? <HomeContent educatorEmail={user.email} isLoggedIn={passwordValid} accountType={getUserType(localEmail)||""}/>
            : 
            <>
            <div className="tutor-interface">
                <div className = "header-box">
                    <h1>Hi {name},<br/><span className="questions">What would you like to do today?</span></h1>
                </div>
                <div className="body-box">
                    <Link href="/educator/userProfile" className="profile-box">View and Edit your profile<img src="/user.png"/></Link>
                    <Link href="/educator/apply" className="apply-box">Apply for a course<img src="/book.png"/></Link>
                </div>
            </div>
            </>}
            <Footer isLoggedIn={passwordValid} type=""/>
        </>
    );
    
}
