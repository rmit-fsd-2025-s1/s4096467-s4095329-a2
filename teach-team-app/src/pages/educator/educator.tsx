import {Header} from "../../components/Header/Header";
import {Footer} from "../../components/Footer/Footer";
import {HomeContent} from "../../components/Home/Home";
import { isPasswordValid, userCred, getPasswordForUser, getUserType, getName, getCandidates} from "../../helpers/validate";

import { LoadingScreen } from "@/components/LoadingScreen/LoadingScreen";
import "../../styles/user-home.css";
import { useEffect, useState} from "react";
import Link from "next/link";
import { Spinner } from "@chakra-ui/react"

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
    let candidates = getCandidates(user.email);

    return(
        <>
            <title>Lecturer Home</title>
            <Header isLoggedIn={passwordValid} accountType={loginType}/>

            {loginType === "lecturer" && (
            <div className="lecturer-interface">
                <div className="l-header">
                    <h2>Welcome back {name}!<br/> You have <span className="numCand">{candidates}</span> new applicants</h2>
                </div>
                <div className="subjects-header">
                    <h1>Courses</h1>
                </div>
                <div className="subjects-box">
                    <HomeContent educatorEmail={user.email} isLoggedIn={passwordValid} accountType={getUserType(localEmail)||""}/>
                </div>
            </div>)}
        
            {loginType === "tutor" && (
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
                </>
            )}
            
            {/* Loading area to prevent empty page */}
            {loginType !== "lecturer" && loginType !== "tutor" && (
                <>
                    <LoadingScreen/>
                </>
            )}

            <Footer isLoggedIn={passwordValid} type=""/>
        </>
    );
    
}
