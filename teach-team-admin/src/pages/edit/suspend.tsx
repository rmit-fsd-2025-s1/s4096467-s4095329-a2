import { userService } from "@/services/api";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { LoadingScreen } from "@/components/Footer/LoadingScreen/LoadingScreen";
import styles from "../add/addCourses.module.css";
import localStyles from "./suspend.module.css";
import { User } from "@/data-types/User";
import { Alert, Button, Card } from "@chakra-ui/react";
import { errorProps } from "../add/addCourses";

export default function Suspend(){
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

    // Getting the user's role to change display depending on the role setutored
    const [loginType, setLoginType] = useState<string>("");
    useEffect(() => {
        const getTypeVal = async () => {
            const type = await userService.getRole(localEmail)
            setLoginType(type);
        }
        getTypeVal();
    });

    // Get the existing courses in the system
    const [tutorList, setTutorList] = useState<User[]>([]);
    useEffect(() => {
        const getTutorList = async () => {
            const tutors = await userService.getAllTutors();
            setTutorList(tutors);
        }
        getTutorList();
    },[]);

    // This controls the success popout
    const [popout, setPopout] = useState<errorProps>({status: "success", message: "Loading", showAlert: false});

    // This toggles the suspend status of a tutor of email provided
    const toggleSuspend = async (email: string) => {
        const tutors = await userService.toggleSuspend(email);
        if(tutors.success){
            setTutorList(tutors.userReturn);

            setPopout({status:"success", message: "Changed Successfully", showAlert: true});
            setTimeout(() => setPopout({status:"info", message: "Loading", showAlert: false}), 3000);
        }
        else{
            setPopout({status:"error", message: "Something Went Wrong", showAlert: true});
            setTimeout(() => setPopout({status:"info", message: "Loading", showAlert: false}), 3000);
        }
    };


    return(<>
    <div className="main-container">
        <Header isLoggedIn={passwordValid} accountType={loginType}/>
        <main>
            { passwordValid ? <>
                <h1 className={styles.titleClass}>Suspend Tutor Accounts</h1>
                
                <div className={styles.courseListBox}>
                    {tutorList.length > 0 ? (
                        <ul>
                            {tutorList.map((tutor, idx) => (
                                <li key={idx}>
                                    <Card.Root p={5}>
                                        <Card.Header>
                                            <label className={localStyles.tutorButton}>
                                                <Button colorPalette={tutor.active?"purple":"red"} p={3} width={100} onClick={() => toggleSuspend(tutor.email)}>{tutor.active?"Suspend":"Un-suspend"}</Button>
                                                <strong>{tutor.full_name} | {tutor.email}</strong>
                                            </label>
                                        </Card.Header>
                                        <Card.Body>
                                            <p><strong>Availability:</strong> {tutor.availability && tutor.availability.length > 0 ? tutor.availability : "None Provided"}</p>
                                            <p><strong>Summary:</strong> {tutor.summary && tutor.summary.length > 0 ? tutor.summary : "None Provided"}</p>
                                            <p><strong>Active:</strong> {tutor.active? (<span className={localStyles.unsuspended}>Account Active</span>) : (<span className={localStyles.suspended}>Account Suspended</span>)}</p>
                                        </Card.Body>
                                    </Card.Root>
                                </li>
                            ))}
                        </ul>
                    ) : <p>No tutorurers returned</p>} 
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