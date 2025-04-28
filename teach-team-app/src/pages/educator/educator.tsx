import {Header} from "../../components/Header/Header";
import {Footer} from "../../components/Footer/Footer";
import {HomeContent} from "../../components/Home/Home";
import { isPasswordValid, userCred, getUserType, getUserData } from "../../helpers/validate";

import { LoadingScreen } from "@/components/LoadingScreen/LoadingScreen";
import "../../styles/user-home.css";
import { useEffect, useState, useMemo} from "react";
import Link from "next/link";
import { Button, Input, InputGroup } from "@chakra-ui/react"
import { SearchTable } from "@/components/SortingTable/SearchTable";
import { useIfLocalStorage } from "@/hooks/useIfLocalStorage";
import { loadDB } from "@/helpers/loadStorage";
import { getLocalCandidates } from "@/helpers/localStorageGet";

export default function EducatorDashboard()
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

    // https://react.dev/reference/react/useMemo prevents lag by only getting data when fields change instead of having it fetch data every search input.
    const user: userCred = useMemo(() => ({
            email: localEmail,
            password: localPassword
        }), [localEmail, localPassword]);
    const data = useMemo(() => getUserData(user.email), [user.email]);
    const passwordValid = useMemo(() => isPasswordValid(user), [user]);
    const loginType = useMemo(() => getUserType(user.email), [user.email]);

    const name = data?.name??"";
    //Yes, I know this leaks the data from localStorage, no, this will not be a thing (Hopefully) when we migrate to using databases.
    const[localDB,] = useIfLocalStorage("localDB", loadDB());
    const candidates = getLocalCandidates(user.email, localDB.subjects);

    //Button manager for lecturer
    const[currentButton, setCurrentButton] = useState<string>("Name");
    //Input Hook
    const[searchBar, setSearchBar] = useState<string>("");

    const[sortingMethod, setSortingMethod] = useState("none Accepted");
    const toggleSort = () => {
        if (sortingMethod === "none Accepted") setSortingMethod("ascending");
        else if (sortingMethod === "ascending") setSortingMethod("descending");
        else setSortingMethod("none Accepted");
    };

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
                    <div className="bar"><p>Tutor Search</p></div>
                    <div className="flex-sbs-stock green-top">
                        <div className="flex-sbs-stock">
                            <p>Sort</p>
                            <div className="flex-column2">
                                <Button p="4" width="300px" variant={"solid"} onClick={() => toggleSort()}>{sortingMethod === "None Accepted" ? "None Accepted" : sortingMethod === "ascending" ? "Sorted by acceptance ascending" : "Sorted by acceptance descending"}</Button>
                            </div>
                        </div>
                        <div className="flex-sbs-stock">
                            <p>Filters</p>
                            <div className="flex-column1">
                                <Button width="100px" variant={currentButton === "Name" ? "outline":"solid"} onClick={()=>{setCurrentButton("Name")}}>Tutor Name</Button>
                                <Button width="100px" variant={currentButton === "Course" ? "outline":"solid"} onClick={()=>{setCurrentButton("Course")}}>Course Name</Button>
                                <Button width="100px" variant={currentButton === "Availability" ? "outline":"solid"} onClick={()=>{setCurrentButton("Availability")}}>Availability</Button>
                                <Button width="100px" variant={currentButton === "Skill" ? "outline":"solid"} onClick={()=>{setCurrentButton("Skill")}}>Skillset</Button>
                            </div>
                            <InputGroup width="50%" startElement={<span className="material-symbols-outlined">search</span>}>
                                <Input placeholder="Search" onChange={(e)=>{setSearchBar(e.target.value)}}/>
                            </InputGroup>
                        </div>
                    </div>
                    <SearchTable tableArr={localDB.users.map(([, value]) => value)} classes={localDB.subjects.map(([, value]) => value)} sort={sortingMethod} type={currentButton} keyword={searchBar} order=""/>
                </div>
            </div>)}
        
            {loginType === "tutor" && (
                <>
                <div className="tutor-interface">
                    <div className = "header-box">
                        <h1>Hi {name},<br/><span className="questions">What would you like to do today?</span></h1>
                    </div>
                    <div className="body-box">
                        <Link href="/educator/userProfile" className="profile-box">View and Edit your profile<img src="/user.png" alt="User Image"/></Link>
                        <Link href="/educator/apply" className="apply-box">Apply for a course<img src="/book.png" alt="Stack of books"/></Link>
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
