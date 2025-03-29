import {Header} from "../../components/Header/Header";
import {Footer} from "../../components/Footer/Footer";
import {HomeContent} from "../../components/Home/Home";
import { isPasswordValid, userCred, getPasswordForUser, getUserType, isLecturerForClass, generateSubjects, userState, subject, generateUsers} from "../../helpers/validate";
import { useRouter } from 'next/router';
import { For, Stack, Table } from "@chakra-ui/react";

import "../../styles/user-home.css";
import { useEffect, useState } from "react";
import { InvalidLogin } from "@/components/InvalidLogin/InvalidLogin";
import { TutorSubjectTable, dualTableProps } from "@/components/SortingTable/SortingTable";
import { useLocalStorage } from "@/hooks/useLocalStorage";



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
    let loginType = getUserType(user.email);
    let content;

    //Pull sample values
    let dbSubj: Map<string, subject> = generateSubjects();
    let dbTut: Map<string, userState> = generateUsers();
    //Create tutors array
    let tutors: userState[] = [];

    //SELECT <values> FROM tutors as t LEFT JOIN subject as s ON t.email = s.tutor WHERE s.subject_name = ?
    if(dbSubj.has(subject??""))
        {
            dbSubj.get(subject??"")?.candidates.forEach((it) => {
                const tutor: userState | undefined = dbTut.get(it);
                if (tutor) {
                    tutors.push(tutor);
                }
            })
        }

        //Create hooks to update the tables
    const[candidateList, setCandidateList] = useLocalStorage<userState[]>("tempCandidateList", tutors);
    const[selectedList, setSelectedList] = useLocalStorage<userState[]>("tempSelectedList", []);

    //Generate content based on logged in status
    if(passwordValid && (getUserType(localEmail) === "lecturer") && isLecturerForClass(localEmail, subject??""))
        {
            //Generate props to be passed into the table generators.
            let table1Props: dualTableProps = {table1: candidateList, setTable1: setCandidateList, table2: selectedList, setTable2: setSelectedList}
            let table2Props: dualTableProps = {table2: candidateList, setTable2: setCandidateList, table1: selectedList, setTable1: setSelectedList}

            content = <>
                <h2>{subject}</h2>
                <div className="flex-sbs flex-gap">
                    {TutorSubjectTable(table1Props??"")}
                    {TutorSubjectTable(table2Props??"")}
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
            <Header isLoggedIn={passwordValid} accountType={loginType}/>
            {content}
            <Footer isLoggedIn={passwordValid} type=""/>
        </>
    );
    
}