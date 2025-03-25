import Link from "next/link";
import { InvalidLogin } from "../InvalidLogin/InvalidLogin";
import "./Home.css";
import { Card } from "@chakra-ui/react";

interface EducatorProps
{
    isLoggedIn: boolean, //Boolean to track if the user is logged in
    accountType: string; //String that determines if it loads Lecturer or Tutor version of the page
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
            <Card.Root _hover={{bg: "gray.100", boxShadow: "md"}} transition="background 0.05s ease-in-out" boxShadow={"sm"}>
                <Card.Header>{subjectCode}</Card.Header>
                <Card.Body>{subjectName}<br/>New Applicants: {subjectApplicants}</Card.Body>
            </Card.Root>
        </Link>
    );
}

export function HomeContent({isLoggedIn, accountType}: EducatorProps)
{
    //If the user is logged in
    if(isLoggedIn)
    {
        return(
            // If the account is a lecturer
            accountType === "lecturer" ? 
            <div className="home-content">
                <div className="home-grid">
                    <CreateSubject subjectCode={"COSC1121"} subjectName={"Database Applications"} subjectApplicants={30}/>
                    <CreateSubject subjectCode={"COSC1122"} subjectName={"Database Applications"} subjectApplicants={30}/>
                    <CreateSubject subjectCode={"COSC1123"} subjectName={"Database Applications"} subjectApplicants={30}/>
                    <CreateSubject subjectCode={"COSC1124"} subjectName={"Database Applications"} subjectApplicants={30}/>
                    <CreateSubject subjectCode={"COSC1125"} subjectName={"Database Applications"} subjectApplicants={30}/>
                    <CreateSubject subjectCode={"COSC1126"} subjectName={"Database Applications"} subjectApplicants={30}/>
                </div>
            </div>
            : //Else, they are a tutor
            <div>
                <p>Damn, you're a tutor now</p>
            </div>
        );
    }
    else //User is not logged in
    {
        return(<InvalidLogin/>);
    }

    
}