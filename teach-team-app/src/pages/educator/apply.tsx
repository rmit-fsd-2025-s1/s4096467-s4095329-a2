import {Header} from "../../components/Header/Header";
import {Footer} from "../../components/Footer/Footer";
import {HomeContent} from "../../components/Home/Home";
import { isPasswordValid, userCred, getPasswordForUser, getUserType} from "../../helpers/validate";
import { Spinner } from "@chakra-ui/react"

import "../../styles/user-home.css";
import "../../components/Home/Home.css";
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
    let loginType = getUserType(user.email);

    return(
        <>
            <Header isLoggedIn={passwordValid} accountType={loginType}/>
            {loginType === "tutor" && (
            <div className="lecturer-interface">
                <div className="subjects-header">
                    <h1>Available Courses</h1>
                </div>
                <div className="subjects-box-t">
                    <HomeContent educatorEmail={user.email} isLoggedIn={passwordValid} accountType={getUserType(localEmail)||""}/>
                </div>
            </div>)}

            {/* Loading area to prevent empty page */}
            {loginType !== "tutor" && (
                <>
                <div className="load">
                    <h1>Loading...</h1>
                    <Spinner color="rgb(59, 189, 91)" size="xl" borderWidth="4px"/>
                </div>
                </>
            )}
            <Footer isLoggedIn={passwordValid} type=""/>

        </>
    );
    
}
