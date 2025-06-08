import { userService } from "@/services/api";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { LoadingScreen } from "@/components/Footer/LoadingScreen/LoadingScreen";
import styles from "../add/addCourses.module.css";
import localStyles from "./reports.module.css";
import { Button, Card } from "@chakra-ui/react";
import { Courses } from "@/data-types/Courses";


export default function ReporManager(){
    // Setting up Local storage email and password for identifications
    const[localEmail, setLocalEmail] = useState<string>("");
    const[localPassword, setLocalPassword] = useState<string>("");
    
    useEffect(() => 
    {
        setLocalEmail(localStorage.getItem("localEmail")||"");
    }, []);
    
    useEffect(() => 
    {
        setLocalPassword(localStorage.getItem("localPassword")||"");
    }, []);

    // Checking to see if the user's login is valid
    const [passwordValid, setPasswordValid] = useState<boolean>(false);
    useEffect(() => {
        const validatePassword = async () => {
            const isValid = await userService.validateLogin(localEmail, localPassword);
            setPasswordValid(isValid);
        };
        validatePassword();
    }, [localEmail, localPassword]);

    // Getting the user's role to change display depending on the role selected
    const [loginType, setLoginType] = useState<string>("");
    useEffect(() => {
        const getTypeVal = async () => {
            const type = await userService.getRole(localEmail)
            setLoginType(type);
        }
        getTypeVal();
    });

    // Keep track of button status
    const [buttonStatus, setButtonStatus] = useState<string>("listCourse");

    // Get all courses
    const [courseTutor, setCourseTutor] = useState<Courses[]>([]);
    useEffect(() => {
        const getCoursesVal = async () => {
            const courses = await userService.getAllCourses();
            setCourseTutor(courses);
        }
        getCoursesVal();
    }, []);


    return(<>
    <div className="main-container">
        <Header isLoggedIn={passwordValid} accountType={loginType}/>
        <main>
            { passwordValid ? <>
                <h1 className={styles.titleClass}>Report Manager</h1>
                <div className={localStyles.buttonFlex}>
                    <Button colorPalette={"purple"} width={300} onClick={()=>setButtonStatus("listCourse")}>List of Candidates</Button>
                    <Button colorPalette={"purple"} width={300} onClick={()=>setButtonStatus("threeCourse")}>More than 3 selections</Button>
                    <Button colorPalette={"purple"} width={300} onClick={()=>setButtonStatus("noneCourse")}>No Selections</Button>
                </div>

                {buttonStatus === "listCourse" ? 
                <div className={styles.courseListBox}>
                    {courseTutor.length > 0 ? (
                        <ul>
                            {courseTutor.map((course, idx) => (
                                <li key={idx}>
                                    <Card.Root p={5}>
                                        <Card.Header>
                                            <span>
                                            <strong>{course.class_code}</strong> | {course.subject_name}
                                            </span>
                                        </Card.Header>
                                        <Card.Body>
                                            <p><strong>Tutors:</strong></p>
                                            <ul>
                                                {course.tutors && course.tutors.length > 0 ? (
                                                    course.tutors.map((lect, idx) => (
                                                        <li key={idx}>{lect.user.full_name} | {lect.email} | {lect.role_name}</li>
                                                    ))
                                                ) : <p>No tutors assigned</p>}
                                            </ul>
                                        </Card.Body>
                                    </Card.Root>
                                </li>
                            ))}
                        </ul>
                    ) : <p>No courses returned</p>} 
                </div>
                : buttonStatus === "threeCourse" ? <></>:
                <></>}
            </> : <LoadingScreen /> }
            </main>
            <Footer isLoggedIn={passwordValid} type={loginType}/>
    </div>
    </>);
}