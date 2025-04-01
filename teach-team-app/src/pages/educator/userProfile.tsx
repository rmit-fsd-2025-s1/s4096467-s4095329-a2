import {Header} from "../../components/Header/Header";
import {Footer} from "../../components/Footer/Footer";
import {HomeContent} from "../../components/Home/Home";
import { isPasswordValid, userCred, getPasswordForUser, getUserType, getSummary, getPrevRoles, getAvail, getCertifications, getSkills, getLanguages} from "../../helpers/validate";

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
    let userName = localEmail.substring(0, localEmail.indexOf("@"));
    let summary = getSummary(user.email);
    let roles = getPrevRoles(user.email);
    let availability = getAvail(user.email);
    let cert = getCertifications(user.email);
    let skills = getSkills(user.email);
    let languages = getLanguages(user.email);

    return(
        <>
            <Header isLoggedIn={passwordValid} accountType={loginType}/>
            <h1>Hi, {userName}</h1>
            <h2>Your Details</h2>
            <p>Name:</p>
            <p>Personal Summary</p>
            <p>{summary}</p>
            <br></br>
            <p>Career History</p>
            <p>{roles}</p>
            <br></br>
            <p>Availability</p>
            <p>{availability}</p>
            <br></br>
            <p>Certifications</p>
            <p>{cert}</p>
            <br></br>
            <p>Skills</p>
            <p>{skills}</p>
            <br></br>
            <p>Languages</p>
            <p>{languages}</p>
            <br></br>
            <p>Lecturer Comments</p>
            {/* Get user pfp from database */}
            {/* <img src = "/userpfp.png" height="500px" width="500px"></img> */}
            <Footer isLoggedIn={passwordValid} type=""/>
        </>
    );
    
}
