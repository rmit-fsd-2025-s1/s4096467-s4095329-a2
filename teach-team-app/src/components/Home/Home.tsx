import Link from "next/link";
import { InvalidLogin } from "../InvalidLogin/InvalidLogin";
import "./Home.css";
import { Card ,Button} from "@chakra-ui/react";
import { getLectureClasses, subject, getTutorCourses, generateUsers, userState } from "@/helpers/validate";
import { useIfLocalStorage } from "@/hooks/useIfLocalStorage";
import { loadDB } from "@/helpers/loadStorage";
import React, { useState, useEffect, use } from 'react';

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

function CreateCourses({subjectCode, subjectName, number}: SubjectProps) {
    //Set up state hooks
    const[localEmail, setLocalEmail] = useState<string>("");

    useEffect(() => {
        setLocalEmail(localStorage.getItem("localEmail")||"");
    }, []);

    let email = localEmail;

    // if false then dont show button
    const [applied, setApplied] = useState(false);
    const [num, setNum] = useState<number>(0);

    //checks if there exists an application already for that course.
    useEffect(() => {    
        const appliedStatus = localStorage.getItem(`${email}_appliedTo_${subjectCode}`) || "";
        if (appliedStatus === "true") {
            setApplied(true);
        }
    }, [localEmail, subjectCode]);

    //sends application check to local storage
    const clickApply = (number: number) => {
        setNum(number);
        setApplied(true);
        localStorage.setItem(`${localEmail}_appliedTo_${subjectCode}`, "true");
    }; 

    return(
        //Hover to apply or something like that. Shows course details and apply button
        <div className="courses-format">
            <div className={`${number}`}>
            {/* <p>{number}</p> */}
                <Card.Root _hover={{bg: "gray.100", boxShadow: "md"}} transition="background 0.05s ease-in-out" boxShadow={"sm"} p="4">
                    <Card.Header>{subjectCode}</Card.Header>
                    <Card.Body>{subjectName}<br/></Card.Body>
                    <Card.Footer justifyContent="flex-end">
                        <div className="button-apply">
                            {!applied && num !== number ? <Button variant='subtle' onClick={() => clickApply(number)}>Apply</Button> : <h2>Application Sent!</h2>}
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
        courses = getTutorCourses();
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
                                {/* create courses and assign each course with a number */}
                                {courses.map((courseVar, index) => (
                                    <CreateCourses key={index} number={index + 1} subjectCode={courseVar.code} subjectName={courseVar.subjectName} subjectApplicants={courseVar.candidates.length}/>
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