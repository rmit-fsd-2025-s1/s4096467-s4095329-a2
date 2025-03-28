import {Header} from "../../components/Header/Header";
import {Footer} from "../../components/Footer/Footer";
import {HomeContent} from "../../components/Home/Home";
import { isPasswordValid, userCred, getPasswordForUser, getUserType, isLecturerForClass, generateSubjects, userState, subject, generateUsers} from "../../helpers/validate";
import { useRouter } from 'next/router';
import { For, Stack, Table } from "@chakra-ui/react";

import "../../styles/user-home.css";
import { useEffect, useState } from "react";
import { InvalidLogin } from "@/components/InvalidLogin/InvalidLogin";
import { TutorSubjectTable } from "@/components/SortingTable/SortingTable";



export default function subjectManager()
{
    //Set up state hooks
    const[localEmail, setLocalEmail] = useState<string>("");
    const[localPassword, setLocalPassword] = useState<string>("");
    //Set up Router / get subject name
    const router = useRouter();
    //Thank you https://www.reddit.com/r/nextjs/comments/nb4jju/check_if_routerqueryparam_is_string_or_string/
    const subject = Array.isArray(router.query.data) ? router.query.data[0] : router.query.data;
    
    //Pull from localStorage
    useEffect(() => 
    {
        setLocalEmail(localStorage.getItem("localEmail")||"");
    }, []);
    
    useEffect(() => 
    {
        setLocalPassword(localStorage.getItem("localPassword")||"");
    }, []);

    //Password Checking
    let user: userCred = {email: localEmail, password:localPassword};
    let passwordValid = isPasswordValid(user);

    let content;

    const[candidateList, setCandidateList] = useState<userState>();
    const[selectedList, setSelectedList] = useState<userState>();

    //Generate content based on logged in status
    if(passwordValid && (getUserType(localEmail) === "lecturer") && isLecturerForClass(localEmail, subject??""))
        {
            content = <>
                <h2>{subject}</h2>
                <div className="flex-sbs flex-gap">
                    {TutorSubjectTable(subject??"")}
                    {TutorSubjectTable(subject??"")}
                </div>
            </>
            ;
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