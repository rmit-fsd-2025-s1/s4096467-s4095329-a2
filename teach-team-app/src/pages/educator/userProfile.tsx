import {Header} from "../../components/Header/Header";
import {Footer} from "../../components/Footer/Footer";
import {HomeContent} from "../../components/Home/Home";
import { isPasswordValid, userCred, getPasswordForUser, getUserType, getSummary, 
    getPrevRoles, getAvail, getCertifications, getSkills, getLanguages, getName} from "../../helpers/validate";

import "./userProfile.css";
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
    let name = getName(user.email);
    let summary = getSummary(user.email);
    let roles = getPrevRoles(user.email);
    let availability = getAvail(user.email);
    let cert = getCertifications(user.email);
    let skills = getSkills(user.email);
    let languages = getLanguages(user.email);

    return(
        <>
            <Header isLoggedIn={passwordValid} accountType={loginType}/>
            <div className="profle">
                <div className="userHeader">
                    <h1>Hello {name}</h1>
                    <p>Here you can update your details and see your messages</p>
                </div>
                <div className="about">            
                    <p>About me</p>
                    <p>{summary}</p>
                </div>
                <div className="prevRoles">
                    <p>Career History</p>
                    <p>{roles}</p>
                </div>
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
            </div>
            <Footer isLoggedIn={passwordValid} type=""/>
        </>
    );
    
}
