import {Header} from "../../components/Header/Header";
import {Footer} from "../../components/Footer/Footer";
import {HomeContent} from "../../components/Home/Home";
import { isPasswordValid, userCred, getUserType} from "../../helpers/validate";

import '../../components/Home/Home.css';
import "../../styles/user-home.css";
import { useEffect, useState } from "react";
import { LoadingScreen } from "@/components/LoadingScreen/LoadingScreen";

export default function ApplyScreen()
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

    const user: userCred = {email: localEmail, password:localPassword};
    const passwordValid = isPasswordValid(user);
    const loginType = getUserType(user.email);

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
                <LoadingScreen/>
                </>
            )}

            
            <Footer isLoggedIn={passwordValid} type=""/>

        </>
    );
    
}