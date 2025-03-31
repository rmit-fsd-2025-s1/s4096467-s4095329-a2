import Link from "next/link";
import { InvalidLogin } from "../InvalidLogin/InvalidLogin";
import "./Home.css";
import { Card } from "@chakra-ui/react";
import { getLectureClasses, subject } from "@/helpers/validate";

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

export function HomeContent({isLoggedIn, accountType, educatorEmail}: EducatorProps)
{
    let classes: subject[] = [];

    if(educatorEmail)
        {
            classes = getLectureClasses(educatorEmail);
        }
            
    //If the user is logged in
    if(isLoggedIn)
    {
        return(
            // If the account is a lecturer
            accountType === "lecturer" ? 
            <div className="home-content">
                <div className="home-grid">
                    {classes.map((classVar) => (
                        <CreateSubject subjectCode={classVar.code} subjectName={classVar.subjectName} subjectApplicants={classVar.candidates.length}/>
                    ))}
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