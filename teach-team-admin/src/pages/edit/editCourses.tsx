import { userService } from "@/services/api";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { LoadingScreen } from "@/components/Footer/LoadingScreen/LoadingScreen";
import { Courses } from "@/data-types/Courses";
import styles from "./editCourses.module.css";
import { Alert, Button, Card, Field, Input } from "@chakra-ui/react";
import { DiBackbone } from "react-icons/di";

export default function EditCourses(){
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

    // Get the existing courses in the system
    //Call refresh upon deleting
    const[updateCourses, setUpdateCourses] = useState(false);
    const [courseList, setCourseList] = useState<Courses[]>([]);
    const getCourseList = async () => {
        try {
            const courses = await userService.getAllCourses();
            console.log("Fetched courses:", courses);
            setCourseList(courses);
        } catch (e) {
            console.error("Failed to get courses");
        }
    };
     
    useEffect(() => {
        getCourseList();
    }, []);

    const edit = async (course: Courses) => {
        console.log("Edit course:", course);
    };

    const del = async (course: Courses) => {
    try {
        const result = await userService.deleteCourse(course)
        console.log(result)
        window.location.reload();
    } catch (error) {
        console.error("Failed to delete course", error);
    }
    };
    
    return(<>
    <div className="main-container">
        <Header isLoggedIn={passwordValid} accountType={loginType}/>
        <main>
            { passwordValid ? "": <LoadingScreen /> }
            <div className={styles.headC}><h1>Edit Or Delete Classes</h1></div>
            <div className={styles.courseListBox}>
                    {courseList.length > 0 ? (
                        <ul>
                            {courseList.map((course, idx) => (
                                <li key={idx}>{<Card.Root p={5}><Card.Header>{course.class_code + " | " + course.subject_name}</Card.Header>
                                <div className={styles.buttonGroup}>
                                <Button colorPalette={"purple"} size="md" onClick={() => edit(course)}>Edit</Button>
                                <Button colorPalette={"purple"} size="md" onClick={() => del(course)}>Delete</Button></div></Card.Root>}</li>
                            ))}
                        </ul>
                    ) : <p>No courses returned</p>} 
                </div>
        </main>
        <Footer isLoggedIn={passwordValid} type={loginType}/>
    </div>
    </>);
}