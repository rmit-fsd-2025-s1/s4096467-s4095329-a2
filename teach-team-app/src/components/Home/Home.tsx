import Link from "next/link";
import "./Home.css";

interface EducatorProps
{
    isLoggedIn: Boolean, //Boolean to track if the user is logged in
    accountType: String; //String that determines if it loads Lecturer or Tutor version of the page
}

interface SubjectProps
{
    subjectCode: String,
    subjectName: String,
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
    return(
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
        :
        <div>
            <p>Damn, you're a tutor now</p>
        </div>
    )
}