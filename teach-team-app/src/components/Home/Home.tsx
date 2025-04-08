import Link from "next/link";
import { InvalidLogin } from "../InvalidLogin/InvalidLogin";
import "./Home.css";
import { Card ,Button} from "@chakra-ui/react";
import { getLectureClasses, subject, getTutorCourses } from "@/helpers/validate";
import React, { useState, useEffect } from 'react';

interface EducatorProps
{
    isLoggedIn: boolean, //Boolean to track if the user is logged in
    accountType: string; //String that determines if it loads Lecturer or Tutor version of the page
    educatorEmail?: string;
}

interface SubjectProps
{
    subjectCode: string,
    subjectName: string,
    subjectApplicants: number;
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

function CreateCourses({subjectCode, subjectName, subjectApplicants}: SubjectProps) {
    
    // TODO MAKE SURE IT SAVES
    // if false then dont show button
    const [showButton, setShowButton] = useState(true);

    const clickApply = () => {
        console.log("You have applied"); 
        setShowButton(!showButton);
    }; 
 
    return(
        //Hover to apply or something like that. Shows course details and apply button
        <Card.Root _hover={{bg: "gray.100", boxShadow: "md"}} transition="background 0.05s ease-in-out" boxShadow={"sm"} p="4">
            <Card.Header>{subjectCode}</Card.Header>
            <Card.Body>{subjectName}<br/></Card.Body>
            <Card.Footer justifyContent="flex-end">
                <div className="button-apply">
                    {showButton ? <Button variant='subtle' onClick={clickApply}>Apply</Button> : <h2>You have applied!</h2>}
                </div>
            </Card.Footer>
        </Card.Root>
    );
}

export function HomeContent({isLoggedIn, accountType, educatorEmail}: EducatorProps)
{
    let classes: subject[] = [];
    let courses: subject[] = [];

    if(educatorEmail) {
            classes = getLectureClasses(educatorEmail);
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
                                {classes.map((classVar) => (
                                    <CreateSubject subjectCode={classVar.code} subjectName={classVar.subjectName} subjectApplicants={classVar.candidates.length}/>
                                ))}
                            </div>
                        </>
                    )}
                    {accountType === "tutor" && (
                        <>
                            <div className="tutor-grid">
                                {courses.map((courseVar) => (
                                    <CreateCourses subjectCode={courseVar.code} subjectName={courseVar.subjectName} subjectApplicants={courseVar.candidates.length}/>
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