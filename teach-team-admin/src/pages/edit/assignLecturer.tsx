import { userService } from "@/services/api";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { LoadingScreen } from "@/components/Footer/LoadingScreen/LoadingScreen";
import styles from "../add/addCourses.module.css";
import localStyles from "./assignLecturer.module.css";
import { User } from "@/data-types/User";
import { Alert, Button, Card } from "@chakra-ui/react";
import { Courses } from "@/data-types/Courses";
import { errorProps } from "../add/addCourses";

export default function AssignLecturer(){
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

    // Hook for holding the selected course in the radion buttons
    const [selectedCourse, setSelectedCourse] = useState<string>("");

    // Get the existing Lecturers in the system
    const [lecturerList, setLecturerList] = useState<User[]>([]);
    const getLecturerList = async (inVal: string) => {
        setSelectedCourse(inVal);
        const lecturers = await userService.getLecturersFor(inVal);
        setLecturerList(lecturers);
    };

    // This controls the success popout
    const [popout, setPopout] = useState<errorProps>({status: "success", message: "Loading", showAlert: false});

    // Attempt to assign lecturer to course
    const assignLecturer = async (lecturerEmail: string) => {
        if(selectedCourse && lecturerEmail){
            const response = await userService.addLecturerToClass(lecturerEmail, selectedCourse);
            if(response.success){
                setLecturerList(response.lectureReturn);
                setCourseList(response.courseReturn);

                setPopout({status:"success", message: "Added Successfully", showAlert: true});
                setTimeout(() => setPopout({status:"info", message: "Loading", showAlert: false}), 3000);
            }
            else {
                setPopout({status:"error", message: "Something Went Wrong", showAlert: true});
                setTimeout(() => setPopout({status:"info", message: "Loading", showAlert: false}), 3000);
            }
        }
    };

    // Get the existing courses in the system
    const [courseList, setCourseList] = useState<Courses[]>([]);
    useEffect(() => {
        const getCourseList = async () => {
            const courses = await userService.getAllCourses();
            setCourseList(courses);
        }
        getCourseList();
    },[]);


    return(<>
    <div className="main-container">
        <Header isLoggedIn={passwordValid} accountType={loginType}/>
        <main>
            { passwordValid ? <>
                    {/* Class Select */}
                <h2 className={localStyles.boxTitle}>Available Classes</h2>
                <div className={styles.courseListBox}>
                    {courseList.length > 0 ? (
                        <ul>
                            {courseList.map((course, idx) => (
                                <li key={idx}>
                                    <Card.Root p={5}>
                                        <Card.Header>
                                            <label className={localStyles.lectCheck}>
                                                <input type="radio" name="selectedCourse" value={course.class_code} onChange={(e) => {getLecturerList(e.target.value)}}/>
                                                <strong>{course.class_code}</strong> | {course.subject_name}
                                            </label>
                                        </Card.Header>
                                        <Card.Body>
                                            <p><strong>Lecturers:</strong></p>
                                            <ul>
                                                {course.lecturers && course.lecturers.length > 0 ? (
                                                    course.lecturers.map((lect, idx) => (
                                                        <li key={idx}>{lect.full_name} | {lect.email}</li>
                                                    ))
                                                ) : <p>No lecturers assigned</p>}
                                            </ul>
                                        </Card.Body>
                                    </Card.Root>
                                </li>
                            ))}
                        </ul>
                    ) : <p>No courses returned</p>} 
                </div>

            {/* Lecturer Select */}
            <h2 className={localStyles.boxTitle}>Available Lecturers</h2>
                <div className={styles.courseListBox}>
                    {lecturerList.length > 0 ? (
                        <ul>
                            {lecturerList.map((lect, idx) => (
                                <li key={idx}>
                                    <Card.Root p={5}>
                                        <Card.Header>
                                            <label className={localStyles.lectCheck}>
                                                <strong>{lect.full_name} | {lect.email}</strong>
                                                <Button colorPalette={"purple"} p={3} width={70} onClick={() => assignLecturer(lect.email)}>Assign</Button>
                                            </label>
                                        </Card.Header>
                                        <Card.Body>
                                            <p><strong>Availability:</strong> {lect.availability && lect.availability.length > 0 ? lect.availability : "None Provided"}</p>
                                            <p><strong>Summary:</strong> {lect.summary && lect.summary.length > 0 ? lect.summary : "None Provided"}</p>
                                            <h3><strong>Teaching:</strong></h3>
                                            <ul>
                                                {lect.lectures && lect.lectures.length > 0 ? (
                                                    lect.lectures.map((course, idx) => (
                                                        <li key={idx}>{course.subject_name} ({course.class_code})</li>
                                                    ))
                                                ) : <p>No courses assigned</p>}
                                            </ul>
                                        </Card.Body>
                                    </Card.Root>
                                </li>
                            ))}
                        </ul>
                    ) : <p>No lecturers returned</p>} 
                </div>

                <Alert.Root status={popout.status} className={!popout.showAlert ? "hidden inv" : "fixed-bottom inv"}>
                    <Alert.Indicator />
                    <Alert.Title>{popout.message}</Alert.Title>
                </Alert.Root>
            </> : <LoadingScreen /> }
        </main>
        <Footer isLoggedIn={passwordValid} type={loginType}/>
    </div>
    </>);
}