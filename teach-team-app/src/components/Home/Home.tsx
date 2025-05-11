import Link from "next/link";
import { InvalidLogin } from "../InvalidLogin/InvalidLogin";
import { Card ,Button} from "@chakra-ui/react";
import { getLectureClasses, subject, getTutorCourses, generateUsers, userState } from "@/helpers/validate";
import { useIfLocalStorage } from "@/hooks/useIfLocalStorage";
import { loadDB, localDBInt } from "@/helpers/loadStorage";
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

    // Gets the status of application for the supplied subject
    const isApplied: string = applicationStatus(subject, email);

    // Applies to the subject and saves to localStorage
    const clickApply = () => {
        //Load LocalDB spread to stop Next/react from freaking out
        const tempDB = { ...localDB };

        //Set the value of the selected subject (found using it's code) in the first array of form [string, value][] push the applicant to the list of candidates
        tempDB.subjects.filter((subjectKeyPair) => subjectKeyPair[0] === subject.code)[0][1].candidates.push(email);

        //Save to localStorage
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
                            {isApplied==="Not Applied" ? //If not applied
                                <Button variant='subtle' onClick={() => clickApply()}>Apply</Button>
                             : isApplied==="Accepted" ? //If accepted
                                <h2>Application Accepted!</h2>
                             : //If application submitted
                                <h2>Application Sent!</h2>}
                        </div>
                    </Card.Footer>
                </Card.Root>
            </div>
        </div>
    );
}

function formatLocalStorageClasses(email: string, localClasses: [string, subject][])
{
    const dbUsers: Map<string, userState> = generateUsers();
    const formattedMap: Map<string, subject> = new Map(localClasses.map((obj) => [obj[0], obj[1]]));
    const lecturerClasses: subject[] = [];

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
    }
    
    if (accountType === "candidate") {
        courses = localDB.subjects.map(([, value]) => value)??getTutorCourses();
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
                    {accountType === "candidate" && (
                        <>
                            <div className="tutor-grid">
                                {/* create courses and assign each course with a number FOR TUTORS */}
                                {courses.map((courseVar) => (
                                    <CreateCourses key={courseVar.code} email={educatorEmail||""} subject={courseVar} localDB={localDB} setLocalDB={setLocalDB}/>
                                ))}
                            </div>
                        </>
                    )}
                    {accountType !== "candidate" && accountType === "lecturer" &&(
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