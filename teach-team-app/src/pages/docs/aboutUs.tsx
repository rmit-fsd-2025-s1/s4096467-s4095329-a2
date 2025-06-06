import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { userCred, isPasswordValid, getUserType } from "@/helpers/validate";
import { useState, useEffect, useMemo } from "react";

export default function AboutUs()
{
    const daysSince = Math.floor((new Date().getTime() - new Date("2025/05/6").getTime()) / (1000 * 60 * 60 * 24));
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

    // https://react.dev/reference/react/useMemo prevents lag by only getting data when fields change instead of having it fetch data every search input.
    const user: userCred = useMemo(() => ({
            email: localEmail,
            password: localPassword
        }), [localEmail, localPassword]);
    
    // Variable hook that checks to see if the user is logged in properly
    const [passwordValid, setPasswordValid] = useState<boolean>(false);
    useEffect(() => {
        const validatePassword = async () => {
            const isValid = await isPasswordValid(user);
            setPasswordValid(isValid);
        };
        validatePassword();
    }, [user]);

    const [loginType, setLoginType] = useState<string>("");
    useEffect(() => {
        const getTypeVal = async () => {
            const type = await getUserType(user.email);
            if(typeof type === "boolean")
            {
                setLoginType("");
            }
            else
            {
                setLoginType(type);
            }
        };
        getTypeVal();
    }, [user]);

    return(
        <>

            <title>About Us</title>
            <Header isLoggedIn={passwordValid} accountType={loginType}/>
            <h1>About Us</h1>
            <h2>Our Founding</h2>
            <p>The TeachTeam platform and company was founded {daysSince} days ago</p>
            <h2>Database ERD</h2>
            <img src="/docs/erd.jpg" alt="ER diagram" />
            <Footer isLoggedIn={passwordValid} type=""/>
        </>
    );
}