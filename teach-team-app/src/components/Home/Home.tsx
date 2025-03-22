import Link from "next/link";
import { InvalidLogin } from "../InvalidLogin/InvalidLogin";
import "./Home.css";

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
        <Link href={"./subjectManager"}>
            <div className="subject-container">
                <h2>{subjectCode}</h2>
                <h2>{subjectName}</h2>
                <h2>New Applicants: {subjectApplicants}</h2>
            </div>
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
                    <CreateSubject subjectCode={"COSC1121"} subjectName={"Database Applications"} subjectApplicants={30}/>
                    <CreateSubject subjectCode={"COSC1121"} subjectName={"Database Applications"} subjectApplicants={30}/>
                    <CreateSubject subjectCode={"COSC1121"} subjectName={"Database Applications"} subjectApplicants={30}/>
                    <CreateSubject subjectCode={"COSC1121"} subjectName={"Database Applications"} subjectApplicants={30}/>
                    <CreateSubject subjectCode={"COSC1121"} subjectName={"Database Applications"} subjectApplicants={30}/>
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