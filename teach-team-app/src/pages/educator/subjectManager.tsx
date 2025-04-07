import {Header} from "../../components/Header/Header";
import {Footer} from "../../components/Footer/Footer";
import {HomeContent} from "../../components/Home/Home";
import { isPasswordValid, userCred, getPasswordForUser, getUserType, isLecturerForClass, generateSubjects, userState, subject, generateUsers} from "../../helpers/validate";
import { useRouter } from 'next/router';
import { Button, For, Stack, Table } from "@chakra-ui/react";

import "../../styles/user-home.css";
import { useEffect, useState } from "react";
import { InvalidLogin } from "@/components/InvalidLogin/InvalidLogin";
import { TutorSubjectTable, dualTableProps } from "@/components/SortingTable/SortingTable";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { loadDB, localDBInt } from "@/helpers/loadStorage";
import { useIfLocalStorage } from "@/hooks/useIfLocalStorage";



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
        const[localDB, setLocalDB] = useIfLocalStorage("localDB", loadDB());

        // Saves changes to the DIY database
        // const saveChanges = ()=>{
            
        // };

        function saveChanges()
        {
            let tempDB:localDBInt = { ...localDB };

            // Setting accepted and candidate tutors using type/javascript spaghetti 
            let acceptedTutor: string[] = selectedList.map(a=>a.email);
            let candidateTutor: string[] = candidateList.map(a=>a.email);
            
            console.log(tempDB.subjects);
            
            console.log(tempDB.subjects.filter((willard) => willard[0] === subject)[0][1]);
            
            // Set the value of the subject accepted
            tempDB.subjects.filter((willard) => willard[0] === subject)[0][1].accepted = acceptedTutor;
            // Set the value of the subject candidates
            tempDB.subjects.filter((willard) => willard[0] === subject)[0][1].candidates = candidateTutor;
            

            setLocalDB(tempDB);

            // console.log(acceptedTutor);
            // console.log(candidateTutor);
        }

    //Generate content based on logged in status
    if(passwordValid && (getUserType(localEmail) === "lecturer") && isLecturerForClass(localEmail, subject??""))
        {
            content = <>
                <div className="subjectName">
                    {subject}
                </div>
                <div className="subMflex-sbs">
                    {/* Generate left table */}
                    <h3>Candidates</h3>
                    <TutorSubjectTable table1={candidateList} table2={selectedList} setTable1={setCandidateList} setTable2={setSelectedList}/>
                    {/* Generate right table */}
                    <h3>Accepted</h3>
                    <TutorSubjectTable table2={candidateList} table1={selectedList} setTable2={setCandidateList} setTable1={setSelectedList}/>
                </div>
                <Button colorPalette={"blue"} p="4" onClick={saveChanges}>Save Changes</Button>
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