import { userService } from "@/services/api";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { Card } from "@chakra-ui/react";
import Link from "next/link";
import styles from "./adminHome.module.css";
import { LoadingScreen } from "@/components/Footer/LoadingScreen/LoadingScreen";

export default function AdminHome(){
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


    return(<>
    <div className="main-container">
        <Header isLoggedIn={passwordValid} accountType={loginType}/>
        <main>
            { passwordValid ? 

            <div className={styles.optionsBox}>
                <Link href="/edit/assignLecturer">
                    <Card.Root _hover={{bg: "gray.100", boxShadow: "md"}} transition="background 0.05s ease-in-out" boxShadow={"sm"} p="4" width="320px" height="320px">
                        <Card.Header>
                            Assign Lecturers
                        </Card.Header>
                        <Card.Body color="grey">
                            Assigning Lecturers to classes
                        </Card.Body>
                    </Card.Root>
                </Link>
                <Link href="/add/addCourses">
                    <Card.Root  _hover={{bg: "gray.100", boxShadow: "md"}} transition="background 0.05s ease-in-out" boxShadow={"sm"} p="4" width="320px" height="320px">
                        <Card.Header>
                            Add Courses
                        </Card.Header>
                        <Card.Body color="grey">
                            Add new courses to the system
                        </Card.Body>
                    </Card.Root>
                </Link>
                <Link href="/edit/editCourses">
                    <Card.Root  _hover={{bg: "gray.100", boxShadow: "md"}} transition="background 0.05s ease-in-out" boxShadow={"sm"} p="4" width="320px" height="320px">
                        <Card.Header>
                            Modify / Delete Courses
                        </Card.Header>
                        <Card.Body color="grey">
                            Edit the details about a course or delete the course
                        </Card.Body>
                    </Card.Root>
                </Link>
                <Link href="/edit/suspend">
                    <Card.Root  _hover={{bg: "gray.100", boxShadow: "md"}} transition="background 0.05s ease-in-out" boxShadow={"sm"} p="4" width="320px" height="320px">
                        <Card.Header>
                            Account Suspension
                        </Card.Header>
                        <Card.Body color="grey">
                            Block users from logging in to their accounts
                        </Card.Body>
                    </Card.Root>
                </Link>
                <Link href="/edit/promote">
                    <Card.Root  _hover={{bg: "gray.100", boxShadow: "md"}} transition="background 0.05s ease-in-out" boxShadow={"sm"} p="4" width="320px" height="320px">
                        <Card.Header>
                            Change Account Types
                        </Card.Header>
                        <Card.Body color="grey">
                            Promote or demote users
                        </Card.Body>
                    </Card.Root>
                </Link>
                <Link href="/report/reportManager">
                    <Card.Root  _hover={{bg: "gray.100", boxShadow: "md"}} transition="background 0.05s ease-in-out" boxShadow={"sm"} p="4" width="320px" height="320px">
                        <Card.Header>
                            Graphing and Reports
                        </Card.Header>
                        <Card.Body color="grey">
                            Get graphs and reports about various categories.
                        </Card.Body>
                    </Card.Root>
                </Link>
            </div>
        : <LoadingScreen /> }
        </main>
        <Footer isLoggedIn={passwordValid} type={loginType}/>
    </div>
    </>);
}