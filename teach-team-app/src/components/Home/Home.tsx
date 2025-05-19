import Link from "next/link";
import { InvalidLogin } from "../InvalidLogin/InvalidLogin";
import { Card ,Button} from "@chakra-ui/react";
import { getLectureClasses, subject, getTutorCourses, generateUsers, userState } from "@/helpers/validate";
import { useIfLocalStorage } from "@/hooks/useIfLocalStorage";
import { loadDB, localDBInt } from "@/helpers/loadStorage";
import { applicationStatus } from "@/helpers/localStorageGet";
import { api, userApi } from "../../services/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

export interface tutorClassObj
{   
    class_code: string,
    subject_name: string,
    tutorApplied: number,
    labApplied: number;
}

interface ApplyProps
{
    subject: tutorClassObj,
    email: string,
    refresh: () => void
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
function CreateCourses({email, subject, refresh}: ApplyProps) {

    // Gets the status of application for the supplied subject
    let isAppliedTut: string = "";

    if(subject.tutorApplied === 1)
        {
            isAppliedTut = "";
        }
    else if(subject.tutorApplied === 2)
        {
            isAppliedTut = "Accepted"
        }
    else
        {
            isAppliedTut = "Not Applied"
        }

    let isAppliedLab: string = "";

    if(subject.labApplied === 1)
        {
            isAppliedLab = "";
        }
    else if(subject.labApplied === 2)
        {
            isAppliedLab = "Accepted"
        }
    else
        {
            isAppliedLab = "Not Applied"
        }

    const clickApply = (role: string) => {
        const applyCourse = async () => {
            try{
                await userApi.applyToCourse(email, subject.class_code, role).then(() => 
                    refresh()
                );
            }
            catch(e)
            {
                refresh();
            }
            };
            applyCourse();
        
    }; 

{console.log(subject)}
    return(
        //Hover to apply or something like that. Shows course details and apply button
        <div className="courses-format">
            <div>
            {/* <p>{number}</p> */}
                <Card.Root _hover={{bg: "gray.50", boxShadow: "md"}} transition="background 0.05s ease-in-out" boxShadow={"sm"} p="4">
                    <Card.Header>{subject.class_code}</Card.Header>
                    <Card.Body>{subject.subject_name}<br/></Card.Body>
                    <Card.Footer justifyContent="flex-end">
                        <div className="button-apply">
                            {isAppliedTut==="Not Applied" ? //If not applied
                                <Button variant='surface' onClick={() => clickApply("tutor")}>Apply Tutor</Button>
                             : isAppliedTut==="Accepted" ? //If accepted
                                <h2>Application Accepted!</h2>
                             : //If application submitted
                                <h2>Application Sent!</h2>}
                        </div>
                        <div className="button-apply">
                            {isAppliedLab==="Not Applied" ? //If not applied
                                <Button variant='surface' onClick={() => clickApply("lab_assistant")}>Apply Lab Assistant</Button>
                             : isAppliedLab==="Accepted" ? //If accepted
                                <h2>Lab Assistant Accepted!</h2>
                             : //If application submitted
                                <h2>Lab Assistant Sent!</h2>}
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
    const router = useRouter();
    let classes: subject[] = [];
    let courses: subject[] = [];
    const [tutorClasses, setTutorClasses] = useState<tutorClassObj[]>([]);

    // I didn't want to do this, but I couldn't find a solution I can make work
    const reloadPage = ()=>{
        router.refresh();
    };
    
        useEffect(() => {
            if(accountType === "candidate")
                {
                    const getCountVal = async () => {
                    if(educatorEmail)
                        {
                            const applications = await userApi.getApplications(educatorEmail||"");
                            setTutorClasses(applications);
                        }
                        else
                        {
                            // This prevents 404 errors
                            setTutorClasses([]);
                        }
                    };
                    getCountVal().then(() => {
                    });
                }
        }, [educatorEmail]);
    

    //Create hooks to update the tables
    const[localDB, setLocalDB] = useIfLocalStorage("localDB", loadDB());
    classes = formatLocalStorageClasses(educatorEmail??"", localDB.subjects)

    if(educatorEmail) {
            classes = getLectureClasses(educatorEmail);
            classes = formatLocalStorageClasses(educatorEmail, localDB.subjects);
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
                                {tutorClasses.map((courseVar, index) => (
                                    <CreateCourses key={index} email={educatorEmail||""} subject={courseVar} refresh={reloadPage}/>
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