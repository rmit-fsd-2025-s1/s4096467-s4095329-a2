import Link from "next/link";
import { InvalidLogin } from "../InvalidLogin/InvalidLogin";
import "./Home.css";
import { Card } from "@chakra-ui/react";
import { getLectureClasses, subject, getTutorCourses } from "@/helpers/validate";

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
                <Card.Body>{subjectName}<br/>New Applicants: {subjectApplicants}</Card.Body>
            </Card.Root>
        </Link>
    );
}

function CreateCourses({subjectCode, subjectName, subjectApplicants}: SubjectProps)
{   
    return(
        //Hover to apply or something like that. Shows course details and apply button
        <Card.Root _hover={{bg: "gray.100", boxShadow: "md"}} transition="background 0.05s ease-in-out" boxShadow={"sm"}>
            <Card.Header>{subjectCode}</Card.Header>
            <Card.Body>{subjectName}<br/></Card.Body>
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
            // If the account is a lecturer
            <div className="home-content">
                <div className="home-grid">
                    {accountType === "lecturer" ? (
                        classes.map((classVar) => (
                        <CreateSubject subjectCode={classVar.code} subjectName={classVar.subjectName} subjectApplicants={classVar.candidates.length}/>
                        ))) 
                    : /*Else a tutor*/( 
                        <div className ="tutor-grid">
                            <p>Damn, you're a tutor now</p>
                            {courses.map((courseVar) => (
                                <CreateCourses subjectCode={courseVar.code} subjectName={courseVar.subjectName} subjectApplicants={courseVar.candidates.length}/>
                            ))}
                        </div>
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