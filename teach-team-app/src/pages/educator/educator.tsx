import {Header} from "../../components/Header/Header";
import {Footer} from "../../components/Footer/Footer";
import {HomeContent} from "../../components/Home/Home";
import { isPasswordValid, userCred, getUserType, User } from "../../helpers/validate";
import { userApi } from "../../services/api";

import { LoadingScreen } from "@/components/LoadingScreen/LoadingScreen";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Button, Input, InputGroup } from "@chakra-ui/react";
import { SearchTable, userData } from "@/components/SortingTable/SearchTable";
import { BarChart, Bar, XAxis, YAxis, Tooltip, TooltipProps } from "recharts";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent"
import { toSentenceCase } from "@/helpers/stringHelper";
import { getUser } from "@/helpers/frontendHelper";
import { detailsDB } from "./userProfile";

// https://recharts.org/en-US/examples/CustomContentOfTooltip
const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if(active && payload && payload.length){
        const data: User = payload[0].payload.person;
        return(
            <div className="custom-tooltip">
                <p className="label"><strong>{label.length > 0 ? label : "Not Provided"}</strong> : {data.email}</p>
                <p><strong>Time Accepted</strong> : {payload[0].value}</p>
                <p><strong>Summary : </strong><ul>{data.summary??"No Summary Provided"}</ul></p>
                <p><strong>Previous Roles : </strong> {data.previous_roles.length >= 1 ? data.previous_roles.map((x,i) => <ul key={i}>{x}</ul>) :<ul>No Previous Roles</ul>}</p>
                <p><strong>Availability:</strong> <ul>{toSentenceCase(data.availability)??"No Availability Provided"}</ul></p>
                <p><strong>Education:</strong> {data.educations.length >= 1 ? data.educations.map((x,i)=> <ul key={i}>{x}</ul>) : <ul>No Education Provided</ul>}</p>
                <p><strong>Certifications:</strong> {data.certifications.length >= 1 ? data.certifications.map((x,i) => <ul key={i}>{x}</ul>) : <ul>No Certifications Provided</ul>}</p>
                <p><strong>Skills:</strong> {data.skills.length >= 1 ? data.skills.map((x,i) => <ul key={i}>{x}</ul>) : <ul>No Skills Provided</ul>}</p>
                <p><strong>Languages:</strong> {data.languages.length >= 1 ? data.languages.map((x,i) => <ul key={i}>{x}</ul>) : <ul>No Languages Provided</ul>}</p>
            </div>
        );
    }
    return null;
} 

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

    //Display new message if true
    const [display, setDisplay] = useState(false)
    const [fullName, setFullName] = useState<Partial<detailsDB>>({
        full_name: "",
    });
    
    useEffect(() => {
            const fetchData = async () => {
                // Prevents getting info when user email is not found yet.
                if (!user.email) {
                    return;
                }
                
                //get data from this specific user via email
                const getdata = await getUser(user.email);
                console.log("Raw user data:", getdata);

                if (getdata && getdata.userData) {
                    setFullName({
                        full_name: getdata.userData.full_name ?? "",
                    });

                    if (getdata.userData.full_name === "") {
                        setDisplay(true);
                    }
                    else {
                        setDisplay(false);
                    }
                }

            };
    
            fetchData();
        }, [user.email]);
    //Yes, I know this leaks the data from localStorage, no, this will not be a thing (Hopefully) when we migrate to using databases.
    const [candidates, setCandidates] = useState<number>(0);
    useEffect(() => {
        const getCountVal = async () => {
            if(user.email)
            {
                const type = await userApi.getCandidateCountLecturer(user.email);
                setCandidates(type);
            }
            else
            {
                // This prevents 404 errors
                setCandidates(0);
            }
        };
        getCountVal();
    }, [user]);

    //Button manager for lecturer
    const[currentButton, setCurrentButton] = useState<string>("tname");
    //Input Hook
    const[searchBar, setSearchBar] = useState<string>("");
    //Availability Selector
    const[availabilitySelect, setAvailabilitySelect] = useState<string>("Any Availability");
    //Role Selector
    const[roleSelect, setRoleSelect] = useState<string>("Any Position");

    const[sortingMethod, setSortingMethod] = useState("@all");
    const toggleSort = () => {
        if (sortingMethod === "@all") 
            setSortingMethod("none");
        else if (sortingMethod === "none") 
            setSortingMethod("desc");
        else if (sortingMethod === "desc") 
            setSortingMethod("asc");
        else
            setSortingMethod("@all")
    };


    // Sets the values for the search table
    const[searchVar, setSearchVar] = useState<userData[]>([]);

    useEffect(()=>{
        const searchPing = async () => {
            const searchResults = await userApi.searchData(sortingMethod, currentButton, searchBar, availabilitySelect, roleSelect);
            setSearchVar(searchResults);
            // console.log("SearchReturn",searchResults);
        }
        searchPing();
    }, [currentButton, searchBar, sortingMethod, availabilitySelect, roleSelect]);

    //TODO Do we ask the user to fill in a form for their full name and other credentials? Like display a different page??
    return(
        <>

            <title>Lecturer Home</title>
            <Header isLoggedIn={passwordValid} accountType={loginType}/>

            {loginType === "lecturer" &&  (
            <div className="lecturer-interface">
                {passwordValid && (<><div className="l-header">
                    <h2>Welcome back {fullName.full_name}!<br/> You have <span className="numCand">{candidates} </span> 
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
                </div></>)}
                
                <div className="subjects-box">
                    <HomeContent educatorEmail={user.email} isLoggedIn={passwordValid} accountType={loginType||""}/>
                </div>
                {passwordValid &&(<div className="lecturers-list-box">
                    <div className="bar"><p>Educator Search</p></div>
                    <div className="flex-sbs-stock green-top no-gap flex-wrap either-end">
                        <div className="flex-sbs-stock" style={{ width: 'auto' }}>
                            <p>Sort</p>
                            <div className="flex-column2">
                                <Button p="4" width="300px" variant={"solid"} onClick={() => toggleSort()}>{sortingMethod === "@all" ? "All Acceptance" : sortingMethod === "none" ? "Never Accepted" : sortingMethod === "asc" ? "Accepted Smallest to largest" : "Accepted largest to smallest"}</Button>
                            </div>
                        </div>
                        <div className="flex-sbs-stock" style={{ width: 'auto' }}>
                            <p>Filters</p>
                            <div className="flex-column1">
                                <Button width="100px" variant={currentButton === "tname" ? "outline":"solid"} onClick={()=>{setCurrentButton("tname")}}>Tutor Name</Button>
                                <Button width="100px" variant={currentButton === "course" ? "outline":"solid"} onClick={()=>{setCurrentButton("course")}}>Course Name</Button>
                                <Button width="100px" variant={currentButton === "skills" ? "outline":"solid"} onClick={()=>{setCurrentButton("skills")}}>Skillset</Button>

                                {/* I Hate Chakra v3 Select components, why are they like 3x harder to use than the v2 Select components */}
                                <select
                                name="availabilityDropdown"
                                value={availabilitySelect}
                                onChange={(e)=>{setAvailabilitySelect(e.target.value)}}
                                className="search-dropdown">
                                    <option>Any Availability</option>
                                    <option>None</option>
                                    <option>Full-time</option>
                                    <option>Part-time</option>
                                    <option>Weekdays</option>
                                    <option>Casual</option>
                                </select>
                                <select
                                name="roleDropdown"
                                value={roleSelect}
                                onChange={(e)=>{setRoleSelect(e.target.value)}}
                                className="search-dropdown">
                                    <option>Any Position</option>
                                    <option>Tutor</option>
                                    <option>Lab-Assistant</option>
                                </select>

                            </div>
                            <InputGroup width="50%" startElement={<span className="material-symbols-outlined">search</span>}>
                                <Input placeholder="Search" onChange={(e)=>{setSearchBar(e.target.value)}}/>
                            </InputGroup>
                        </div>
                    </div>
                    <SearchTable tableDataIn={searchVar}/>

                    <div className="bar"><p>Visual Displays</p></div>
                    <div className="flex-sbs-stock green-top no-gap flex-wrap either-end">
                        <div>
                            <p>{roleSelect} with number of times accepted {sortingMethod === "@all" ? "is anything" : sortingMethod === "none" ? "is none" : sortingMethod === "desc" ? "is largest to smallest excluding 0" : "is smallest to largest excluding 0"}</p>
                            
                            {searchVar.length <= 0 ? <p>No data returned</p> : 
                            <BarChart data={searchVar} 
                                width={1000} 
                                height={550} 
                                style={{marginBottom: "10px"}} 
                                margin={{top: 10, bottom: 150}}>

                                <XAxis dataKey="person.full_name" 
                                    allowDuplicatedCategory 
                                    tick={{textAnchor: "start"}} 
                                    angle={90}/>

                                <YAxis allowDecimals={false} 
                                    minTickGap= {1} />

                                <Tooltip 
                                    
                                    content={<CustomTooltip />}/>

                                <Bar 
                                    dataKey="timesAccepted" 
                                    label="person.full_name" 
                                    fill="#11bf1b" 
                                    stroke="black" 
                                    radius={[10,10,0,0]}/>
                            </BarChart>}
                        </div>
                    </div>
                </div>)}
                
            </div>)}
        
            {loginType === "candidate" && (
                <>
                <div className="tutor-interface">
                    <div className = "header-box">
                        {display ? (
                            <h1>Welcome new user!<br/><span className="questions">Set up your information in the profile page</span></h1>
                        ) : (
                            <h1>Hi {fullName.full_name},<br/><span className="questions">What would you like to do today?</span></h1>
                        )}
                    </div>
                    <div className="body-box">
                        <Link href="/educator/userProfile" className="profile-box">View and Edit your profile<img src="/user.png" alt="User Image"/></Link>
                        <Link href="/educator/apply" className="apply-box">Apply for a course<img src="/book.png" alt="Stack of books"/></Link>
                    </div>
                </div>
                </>
            )}
            
            {/* Loading area to prevent empty page */}
            {loginType !== "lecturer" && loginType !== "candidate" && (
                <LoadingScreen/>
            )}

            <Footer isLoggedIn={passwordValid} type=""/>
        </>
    );
    
}
