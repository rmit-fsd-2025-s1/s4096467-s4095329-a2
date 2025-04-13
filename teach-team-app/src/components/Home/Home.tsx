import Link from "next/link";
import { InvalidLogin } from "../InvalidLogin/InvalidLogin";
import "./Home.css";
import { Card ,Button} from "@chakra-ui/react";
import { getLectureClasses, subject, getTutorCourses, generateUsers, userState } from "@/helpers/validate";
import { useIfLocalStorage } from "@/hooks/useIfLocalStorage";
import { loadDB, localDBInt } from "@/helpers/loadStorage";
import React, { useState, useEffect, use } from 'react';
import { applicationStatus } from "@/helpers/localStorageGet";

interface EducatorProps
{
    isLoggedIn: boolean, //Boolean to track if the user is logged in
    accountType: string; //String that determines if it loads Lecturer or Tutor version of the page
    educatorEmail?: string;
}

interface SubjectProps
{   
    number: number;
    subjectCode: string,
    subjectName: string,
    subjectApplicants?: number;
}

interface ApplyProps
{
    subject: subject,
    email: string,
    localDB: localDBInt,
    setLocalDB: (value: React.SetStateAction<localDBInt>) => void;
}

//Creates a subject block for the Lecturer
function CreateSubject({subjectCode, subjectName, subjectApplicants}: SubjectProps)
{
    return(
        <Link href={{pathname: "./subjectManager",
                     query: {data: subjectCode}
        }}>
            <Card.Root _hover={{bg: "gray.100", boxShadow: "md"}} transition="background 0.05s ease-in-out" boxShadow={"sm"} p="4">
                <Card.Header>{subjectCode}</Card.Header>
                <Card.Body color="grey">{subjectName}<br/>New Applicants: {subjectApplicants}</Card.Body>
            </Card.Root>
        </Link>
    );
}

//Creates application block for tutors
function CreateCourses({email, subject, localDB, setLocalDB}: ApplyProps) {

    let isApplied: string = applicationStatus(subject, email);

    //sends application check to local storage
    const clickApply = () => {
        let tempDB = { ...localDB };

        tempDB.subjects.filter((subjectKeyPair) => subjectKeyPair[0] === subject.code)[0][1].candidates.push(email);

        setLocalDB(tempDB);
    }; 

    return(
        //Hover to apply or something like that. Shows course details and apply button
        <div className="courses-format">
            <div>
            {/* <p>{number}</p> */}
                <Card.Root _hover={{bg: "gray.100", boxShadow: "md"}} transition="background 0.05s ease-in-out" boxShadow={"sm"} p="4">
                    <Card.Header>{subject.code}</Card.Header>
                    <Card.Body>{subject.subjectName}<br/></Card.Body>
                    <Card.Footer justifyContent="flex-end">
                        <div className="button-apply">
                            {isApplied==="Not Applied" ? <Button variant='subtle' onClick={() => clickApply()}>Apply</Button> : isApplied==="Accepted" ? <h2>Application Accepted!</h2>: <h2>Application Sent!</h2>}
                        </div>
                    </Card.Footer>
                </Card.Root>
            </div>
        </div>
    );
}

function formatLocalStorageClasses(email: string, localClasses: [string, subject][])
{
    let dbUsers: Map<string, userState> = generateUsers();
    let formattedMap: Map<string, subject> = new Map(localClasses.map((obj) => [obj[0], obj[1]]));
    let lecturerClasses: subject[] = [];

    if(dbUsers.has(email))
        {
            dbUsers.get(email)?.classes?.forEach((subName) => {
                const classObj: subject | undefined = formattedMap.get(subName);
                if (classObj) {
                    lecturerClasses.push(classObj);
                }
            })
        }
    
    return lecturerClasses;
}

export function HomeContent({isLoggedIn, accountType, educatorEmail}: EducatorProps)
{
    let classes: subject[] = [];
    let courses: subject[] = [];

    //Create hooks to update the tables
    const[localDB, setLocalDB] = useIfLocalStorage("localDB", loadDB());
    classes = formatLocalStorageClasses(educatorEmail??"", localDB.subjects)

    if(educatorEmail) {
            classes = getLectureClasses(educatorEmail);
            classes = formatLocalStorageClasses(educatorEmail, localDB.subjects);
            localDB.subjects
    }
    
    if (accountType === "tutor") {
        courses = localDB.subjects.map(([key, value]) => value)??getTutorCourses();
        console.log("Courses", courses);
    }
    
    //If the user is logged in
    if(isLoggedIn)
    {
        return(
            <div className="home-content">
                <div className="home-grid">
                    {accountType === "lecturer" && (
                        <>
                            <div className="lecture-grid">
                                {classes.map((classVar, index) => ( 
                                    <CreateSubject key={index} number={index + 1} subjectCode={classVar.code} subjectName={classVar.subjectName} subjectApplicants={classVar.candidates.length}/>
                                ))}
                            </div>
                        </>
                    )}
                    {accountType === "tutor" && (
                        <>
                            <div className="tutor-grid">
                                {/* create courses and assign each course with a number FOR TUTORS */}
                                {courses.map((courseVar, index) => (
                                    <CreateCourses email={educatorEmail||""} subject={courseVar} localDB={localDB} setLocalDB={setLocalDB}/>
                                ))}
                            </div>
                        </>
                    )}
                    {accountType !== "tutor" && accountType === "lecturer" &&(
                        <>
                        </>
                    )}
                </div>
            </div>
        );
    }
    else //User is not logged in
    {
        return(<InvalidLogin/>);
    }

    
}