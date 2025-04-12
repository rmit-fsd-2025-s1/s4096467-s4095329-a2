import {Header} from "../../components/Header/Header";
import {Footer} from "../../components/Footer/Footer";
import {HomeContent} from "../../components/Home/Home";
import { isPasswordValid, userCred, getPasswordForUser, getUserType, getUserData, getCandidates, generateUsers} from "../../helpers/validate";

import { LoadingScreen } from "@/components/LoadingScreen/LoadingScreen";
import { InvalidLogin } from "@/components/InvalidLogin/InvalidLogin";
import "../../styles/user-home.css";
import { useEffect, useState} from "react";
import Link from "next/link";
import { Button, Input, InputGroup, Spinner } from "@chakra-ui/react"
import { SearchTable } from "@/components/SortingTable/SearchTable";
import { useIfLocalStorage } from "@/hooks/useIfLocalStorage";
import { loadDB } from "@/helpers/loadStorage";
import { getLocalCandidates } from "@/helpers/localStorageGet";

export default function loginScreen()
{
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

    let user: userCred = {email: localEmail, password:localPassword};
    const data = getUserData(user.email);
    let passwordValid = isPasswordValid(user);
    let loginType = getUserType(user.email);
    let name = data?.name??"";
    //Yes, I know this leaks the data from localStorage, no, this will not be a thing (Hopefully) when we migrate to using databases.
    const[localDB, setLocalDB] = useIfLocalStorage("localDB", loadDB());
    let candidates = getLocalCandidates(user.email, localDB.subjects);

    return(
        <>
            <title>Lecturer Home</title>
            <Header isLoggedIn={passwordValid} accountType={loginType}/>

            {loginType === "lecturer" && (
            <div className="lecturer-interface">
                <div className="l-header">
                    <h2>Welcome back {name}!<br/> You have <span className="numCand">{candidates} </span> 
                    {candidates > 1 ? (
                        <>
                         new applicants
                        </>
                    ) : (
                        <>
                         new applicant
                        </>
                    )}
                    </h2>
                </div>
                <div className="subjects-header">
                    <h1>Courses</h1>
                </div>
                <div className="subjects-box">
                    <HomeContent educatorEmail={user.email} isLoggedIn={passwordValid} accountType={getUserType(localEmail)||""}/>
                </div>
                <div className="lecturers-list-box">
                    <h1>Tutor Database Search</h1>
                    <div className="flex-sbs">
                        <div className="flex-column flexBox"><Button>Course Name</Button><Button>Tutor Name</Button></div>
                        <div className="flex-column flexBox"><Button>Skillset</Button><Button>Availability</Button></div>
                    </div>
                    <InputGroup startElement={<span className="material-symbols-outlined">search</span>}>
                        <Input placeholder="Search" />
                    </InputGroup>

                    <SearchTable tableArr={localDB.users.map(([key, value]) => value)} classes={localDB.subjects.map(([key, value]) => value)} />
                </div>
            </div>)}
        
            {loginType === "tutor" && (
                <>
                <div className="tutor-interface">
                    <div className = "header-box">
                        <h1>Hi {name},<br/><span className="questions">What would you like to do today?</span></h1>
                    </div>
                    <div className="body-box">
                        <Link href="/educator/userProfile" className="profile-box">View and Edit your profile<img src="/user.png"/></Link>
                        <Link href="/educator/apply" className="apply-box">Apply for a course<img src="/book.png"/></Link>
                    </div>
                </div>
                </>
            )}
            
            {/* Loading area to prevent empty page */}
            {loginType !== "lecturer" && loginType !== "tutor" && (
                <LoadingScreen/>
            )}

            <Footer isLoggedIn={passwordValid} type=""/>
        </>
    );
    
}
