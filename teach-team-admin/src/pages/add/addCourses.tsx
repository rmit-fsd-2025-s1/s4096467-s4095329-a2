import { userService } from "@/services/api";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { LoadingScreen } from "@/components/Footer/LoadingScreen/LoadingScreen";
import { Courses, UpdateCourses } from "@/data-types/Courses";
import styles from "./addCourses.module.css";
import { Alert, Button, Card, Field, Input } from "@chakra-ui/react";

interface courseAddParams{
    course_code: string,
    course_name: string,
}

export interface errorProps{
    status: "success" | "info" | "warning" | "error" | "neutral" | undefined,
    message: string,
    showAlert: boolean
}

function isUppercase(inputString: string){
    try{
        const regex = new RegExp("[0-9]");
        const formatString = inputString.substring(0,4);
        if(regex.test(formatString)){
            return false;
        }
        if(formatString === formatString.toUpperCase()){
            return true;
        }
        return false;
    }
    catch(e){
        console.log(e);
        return false;
    }
}

function isLetterUppercase(inputString: string, pos: number){
    try{
        const formatString = inputString.substring(pos,pos+1);
        if(formatString)
        if(formatString === formatString.toUpperCase()){
            return true;
        }
        return false;
    }
    catch(e){
        console.log(e);
        return false;
    }
}

function isNumbers(inputString: string){
    try{
        const regex = new RegExp("^[0-9]+$");
        const formatString = inputString.substring(4);
        if(formatString.length < 4){
            return false;
        }
        if(!regex.test(formatString)){
            return false;
        }
        return true;
    }
    catch(e){
        console.log(e);
        return false;
    }
}

function duplicateCheck(inputString: string, courses: Courses[]){
    let tempCheck: boolean = true;

    courses.map((e) => {
        if(e.class_code === inputString){
            tempCheck = false;
        }
    });
    return tempCheck;
}

export default function AddCourses(){
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
    },[localEmail]);

    // Get the existing courses in the system
    const [courseList, setCourseList] = useState<Courses[]>([]);
    useEffect(() => {
        const getCourseList = async () => {
            const courses = await userService.getAllCourses();
            setCourseList(courses);
        }
        getCourseList();
    },[]);

    // User Input Tracking
    const [userInput, setUserInput] = useState<courseAddParams>({course_code:"", course_name:""});
    const [validSubmit, setValidSubmit] = useState<boolean>(false);
    const [inputError, setInputError] = useState<courseAddParams>({course_code:"", course_name:""});

    // Check every time the user input is updated
    useEffect(()=>{
        try{
            let tempValidSubmit: boolean = true;

            const tempInputError: courseAddParams = { course_code: "", course_name: "" };

            if(!duplicateCheck(userInput.course_code, courseList)){
                tempValidSubmit = false;
                tempInputError.course_code = "Duplicate course code";
            }

            if(!isUppercase(userInput.course_code)){
                tempValidSubmit = false;
                tempInputError.course_code = "First 4 characters must be upper case";
            }
            
            if(!isNumbers(userInput.course_code)){
                tempValidSubmit = false;
                tempInputError.course_code = "Non numbers found after character 4";
            }
            
            if(!isLetterUppercase(userInput.course_name, 0)){
                tempValidSubmit = false;
                tempInputError.course_name = "First character must be upper case";
            }
            
            if(userInput.course_name.length <= 0){
                tempValidSubmit = false;
                tempInputError.course_name = "Must enter a course name"
            }
            
            if(userInput.course_code.length <= 0){
                tempValidSubmit = false;
                tempInputError.course_code = "Must enter a course code";
            }

            if((duplicateCheck(userInput.course_code, courseList))&&(userInput.course_code.length > 0)&&(isUppercase(userInput.course_code))&&(isNumbers(userInput.course_code))){
                tempInputError.course_code = "";
            }
            
            setInputError(tempInputError);
            setValidSubmit(tempValidSubmit);
        }
        catch(e){
            console.log(e);
            setValidSubmit(false);
        }
    }, [courseList, userInput]);

    // This controls the success popout
    const [popout, setPopout] = useState<errorProps>({status: "success", message: "Loading", showAlert: false});

    // Run this when user clicks Add Course button to submit courses
    const submitCourse = async () => {
        const newCourses: UpdateCourses = await userService.addNewCourse(userInput.course_code, userInput.course_name);        
        setCourseList(newCourses.return);
        console.log("Outcome: " + newCourses.success);

        if (newCourses.success){
            setPopout({status:"success", message: "Added Successfully", showAlert: true});
            setTimeout(() => setPopout({status:"info", message: "Loading", showAlert: false}), 3000);
        }
        else {
            setPopout({status:"error", message: "Something Went Wrong", showAlert: true});
            setTimeout(() => setPopout({status:"info", message: "Loading", showAlert: false}), 3000);
        }
    }

    return(<>
    <div className="main-container">
        <Header isLoggedIn={passwordValid} accountType={loginType}/>
        <main>
            { passwordValid ? <>
                <h1 className={styles.titleClass}>Create New Classes</h1>
                <div className={styles.courseListInputBox}>
                    <Field.Root invalid={inputError.course_code.length>0}>
                        <Field.Label>Course Code</Field.Label>
                        <Input onChange={(e)=>setUserInput({...userInput, course_code: e.target.value})}
                            placeholder="Course Code"/>
                        <Field.ErrorText>{inputError.course_code}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root invalid={inputError.course_name.length>0}>
                        <Field.Label>Course Name</Field.Label>
                        <Input onChange={(e)=>setUserInput({...userInput, course_name: e.target.value})}
                            placeholder="Course Name"/>
                        <Field.ErrorText>{inputError.course_name}</Field.ErrorText>
                    </Field.Root>
                    <Button disabled={!validSubmit} colorPalette={"purple"} size="md" onClick={submitCourse}>Add Course</Button>
                </div>
                <div className={styles.courseListBox}>
                    {courseList.length > 0 ? (
                        <ul>
                            {courseList.map((course, idx) => (
                                <li key={idx}>{<Card.Root p={5}>
                                        <Card.Header>{course.class_code + " | " + course.subject_name}</Card.Header>
                                    </Card.Root>}</li>
                            ))}
                        </ul>
                    ) : <p>No courses returned</p>} 
                </div>

                <Alert.Root status={popout.status} className={!popout.showAlert ? "hidden inv" : "fixed-bottom inv"}>
                    <Alert.Indicator />
                    <Alert.Title>{popout.message}</Alert.Title>
                </Alert.Root>

            </>: <LoadingScreen /> }
        </main>
        <Footer isLoggedIn={passwordValid} type={loginType}/>
    </div>
    </>);
}