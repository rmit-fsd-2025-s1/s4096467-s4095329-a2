import {Header} from "../../components/Header/Header";
import {Footer} from "../../components/Footer/Footer";
import {HomeContent} from "../../components/Home/Home";
import { isPasswordValid, userCred, getUserType} from "../../helpers/validate";

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
    // Variable hook that checks to see if the user is logged in properly
    const [passwordValid, setPasswordValid] = useState<boolean>(false);
    useEffect(() => {
        //Basically what this does is that
        //Set true  when page is loaded
        let isLoaded = true;

        const validatePassword = async () => {
            const isValid = await isPasswordValid(user);
            console.log(isValid)
            // Only update state if page is still loaded
            if(isLoaded) {
                setPasswordValid(isValid);
            }
        };
        validatePassword();

        return () => {
            isLoaded = false; //When you use the backbutton React will run this saying that the page is gone.
        };
    }, [user.email]);

    const [loginType, setLoginType] = useState<string>("");
    useEffect(() => {
        //Same logic applies here.
        let isLoaded = true;

            const getTypeVal = async () => {
                console.log(user.email)
                const type = await getUserType(user.email);
                if (isLoaded) {
                    setLoginType(typeof type === "boolean" ? "" : type);
                }
            };

            if (user.email) {
                getTypeVal();
            }

            return () => {
                isLoaded = false;
            };
    }, [user.email]);

    return(
        <>
            <Header isLoggedIn={passwordValid} accountType={loginType}/>
            {loginType === "candidate" && (
            <div className="lecturer-interface">
                <div className="subjects-header">
                    <h1>Available Courses</h1>
                </div>
                <div className="subjects-box-t">
                    <HomeContent educatorEmail={user.email} isLoggedIn={passwordValid} accountType={loginType||""}/>
                </div>
            </div>)}

            {/* Loading area to prevent empty page */}
            {loginType !== "candidate" && (
                <>
                <LoadingScreen/>
                </>
            )}

            
            <Footer isLoggedIn={passwordValid} type=""/>

        </>
    );
    
}