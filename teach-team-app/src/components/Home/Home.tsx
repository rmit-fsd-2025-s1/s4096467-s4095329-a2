import Link from "next/link";
import { InvalidLogin } from "../InvalidLogin/InvalidLogin";
import { Card ,Button} from "@chakra-ui/react";
import { userApi } from "../../services/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface EducatorProps
{
    isLoggedIn: boolean, //Boolean to track if the user is logged in
    accountType: string; //String that determines if it loads Lecturer or Tutor version of the page
    educatorEmail?: string;
}

export interface SubjectProps
{   
    number: number;
    class_code: string,
    subject_name: string,
    candidate_count?: number;
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
function CreateSubject({class_code, subject_name, candidate_count}: SubjectProps)
{
    return(
        <Link href={{pathname: "./subjectManager",
                     query: {data: class_code}
        }}>
            <Card.Root _hover={{bg: "gray.100", boxShadow: "md"}} transition="background 0.05s ease-in-out" boxShadow={"sm"} p="4">
                <Card.Header>{class_code}</Card.Header>
                <Card.Body color="grey">{subject_name}<br/>New Applications: {candidate_count}</Card.Body>
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
                console.log(e);
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

export function HomeContent({isLoggedIn, accountType, educatorEmail}: EducatorProps)
{
    const router = useRouter();
    const [tutorClasses, setTutorClasses] = useState<tutorClassObj[]>([]);
    const [lecturerClasses, setLecturerClasses] = useState<SubjectProps[]>([]);

    // I didn't want to do this, but I couldn't find a solution I can make work
    const reloadPage = ()=>{
        router.refresh();
    };
    
    //Set tutorClasses if user is candidate
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
    }, [accountType, educatorEmail]);
    
    //Set lecturerClasses if user is lecturer
    useEffect(() => {
        if(accountType === "lecturer")
            {
                const getCountVal = async () => {
                if(educatorEmail)
                    {
                        const courses = await userApi.getCourseCardInfo(educatorEmail||"");
                        setLecturerClasses(courses);
                    }
                    else
                    {
                        // This prevents 404 errors
                        setLecturerClasses([]);
                    }
                };
                getCountVal().then(() => {
                });
            }
    }, [accountType, educatorEmail]);

    //If the user is logged in
    if(isLoggedIn)
    {
        return(
            <div className="home-content">
                <div className="home-grid">
                    {accountType === "lecturer" && (
                        <>
                            <div className="lecture-grid">
                                {lecturerClasses.map((classVar, index) => ( 
                                    <CreateSubject key={index} number={index + 1} class_code={classVar.class_code} subject_name={classVar.subject_name} candidate_count={classVar.candidate_count}/>
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