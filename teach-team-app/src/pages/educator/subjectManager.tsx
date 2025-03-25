import {Header} from "../../components/Header/Header";
import {Footer} from "../../components/Footer/Footer";
import {HomeContent} from "../../components/Home/Home";
import { isPasswordValid, userCred, getPasswordForUser, getUserType, isLecturerForClass} from "../../helpers/validate";
import { useRouter } from 'next/router';

import "../../styles/user-home.css";
import { useEffect, useState } from "react";
import { InvalidLogin } from "@/components/InvalidLogin/InvalidLogin";

export default function subjectManager()
{
    const[localEmail, setLocalEmail] = useState<string>("");
    const[localPassword, setLocalPassword] = useState<string>("");
    const router = useRouter();
    //Thank you https://www.reddit.com/r/nextjs/comments/nb4jju/check_if_routerqueryparam_is_string_or_string/
    const subject = Array.isArray(router.query.data) ? router.query.data[0] : router.query.data;
    
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

    let content;

    if(passwordValid && (getUserType(localEmail) === "lecturer") && isLecturerForClass(localEmail, subject??""))
        {
            content = <div>{subject}</div>;
        }
        else
        {
            content = <InvalidLogin/>
        }

    return(
        <>
            <title>Class Name Here</title>
            <Header isLoggedIn={passwordValid} />
            {content}
            <Footer isLoggedIn={passwordValid} type=""/>
        </>
    );
    
}