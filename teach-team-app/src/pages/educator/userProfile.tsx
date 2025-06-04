import {Header} from "../../components/Header/Header";
import {Footer} from "../../components/Footer/Footer";
import { isPasswordValid, userCred, getUserType, getUserData} from "../../helpers/validate";

import Comments from "@/components/SortingTable/Comments";
import React, { useEffect, useState , useMemo} from "react";
import { Button } from "@chakra-ui/react"
import { useIfLocalStorage } from "@/hooks/useIfLocalStorage";
import { loadDB } from "@/helpers/loadStorage";
import { getUser, deleteField, postField } from '../../helpers/frontendHelper'
import { IntegerType } from "typeorm";


export interface details {
    summary: string;
    prevRoles: string;
    avail: string;
    certifications: string;
    education: string;
    skills: string;
    languages: string;
}

//Will add more 
interface Language {
    language_key: number;
    language: string;
}

export interface detailsDB {
    summary: string;
    prevRoles: string[];
    avail: string;
    certifications: string[];
    education: string[];
    skills: string[];
    languages: Language[];
}

const detailsTitle = ['summary', 'prevRoles', 'avail', 'certifications', 'education', 'skills', 'languages'];

//some function to get username form their email before character '@';

export default function UserProfile()
{
    const[localEmail, setLocalEmail] = useState<string>("");
    const[localPassword, setLocalPassword] = useState<string>("");
    const[localDB, setLocalDB] = useIfLocalStorage("localDB", loadDB());
    
    useEffect(() => 
    {
        setLocalEmail(localStorage.getItem("localEmail")||"");
        setLocalPassword(localStorage.getItem("localPassword")||"");

    }, []);
    
    //https://react.dev/reference/react/useMemo
    //UseMemo stops recalculation on every keypress when typing input. This removes lag.
    const user: userCred = useMemo(() => ({
        email: localEmail,
        password: localPassword
    }), [localEmail, localPassword]);
    const data = useMemo(() => getUserData(user.email), [user.email]);

    // Variable hook that checks to see if the user is logged in properly
    const [passwordValid, setPasswordValid] = useState<boolean>(false);
    useEffect(() => {
        const validatePassword = async () => {
            const isValid = await isPasswordValid(user);
            setPasswordValid(isValid);
        };
        validatePassword();
    }, [user]);

    //Get login type from database
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
    const name = data?.name??"";

    // Maybe For later usuage in further assignments
    // let userName = localEmail.substring(0, localEmail.indexOf("@"));
    //We dont need to format the data yet maybe in further assignments
    // let summary = data?.summary??"";
    // let roles = data?.prevRoles??"";
    // let availability  = data?.avail??"";
    // let cert = data?.certifications??""; 
    // let skills = data?.skills??"";
    // let languages = data?.languages??"";
    // let education = data?.education??"";    

    //Create form data using state hook
    const [formData, setFormData] = useState<details>({
        summary: "",
        prevRoles: "",
        avail: "",
        certifications: "",
        education: "",
        skills: "",
        languages: "",
    });
    
    // //testing for lag
    // console.time('getUserData Execution Time');
    // console.timeEnd('getUserData Execution Time');

    //Keeps track of the button you click edit. If null then no field is being edited.
    const [editField, setEditField] = useState<keyof details | null>(null);
    const [temp, setTemp] = useState("");
    
    //Field: keyof makes this dynamic
    //https://www.w3schools.com/typescript/typescript_keyof.php
    const edit = (field: keyof details) => {
        setTemp(formData[field] || "");
        setEditField(field);
    }

    //gets the user input from local storage
    useEffect(() => {
        //makes all the details optional
        const updatedData: Partial<details> = {};
        detailsTitle.forEach((field) => {
            //${} makes it dynamic for each user so that each user doesnt use others formdata
            const userKey = `${field}_${user.email}`;
            updatedData[field as keyof details] = localStorage.getItem(userKey) || "";
        });
        //appends the saved summary to the updated summary
        setFormData((prev) => ({ ...prev, ...updatedData }));
    }, [user.email]);

    //Save input to local storage
    const save = (field: keyof details) => {
        //appends the temp string to the formdata summary
        setFormData((prev) => ({ ...prev, [field]: temp}));   
        const userKey = `${field}_${user.email}`;

        //This is a patch fix. This may be some of the worst code I have ever written, sorry.
        const db = { ...localDB };
        db.users.filter((userKeyPair) => userKeyPair[0] === localEmail)[0][1][field] = [temp];

        setLocalDB(db);
        //END PATCH FIX

        //Sets temp to local storage.
        localStorage.setItem(userKey, temp);
        setEditField(null);
    }    

    //THE DATABASE INTEGRATION HERE
    //NEW WORKSPACE HERE ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const [userData, setUserData] = useState<detailsDB>({
        summary: "",
        prevRoles: [],
        avail: "",
        certifications: [],
        education: [],
        skills: [],
        languages: [],
    });

    //Basically this prevents undefined behaviour if some synchronous or asynchronous shenanigans happens
    useEffect(() => {
        const fetchData = async () => {
            // Prevents getting info when user email is not found yet.
            if (!user.email) {
                return;
            }
            
            //get data from this specific user via email
            const getdata = await getUser(user.email);
            console.log("Raw user data:", getdata);
            //The naming is a bit confusing lol
            //The long code gets from the database and formats it accordingly
            if (getdata && getdata.userData) {
                setUserData({
                    summary: getdata.userData.summary ?? "",
                    prevRoles: getdata.userData.previous_roles ?? [],
                    avail: getdata.userData.availability ?? "",
                    certifications: getdata.userData.certifications ?? [],
                    education: getdata.userData.educations ?? [],
                    skills: getdata.userData.skills ?? [],
                    languages: getdata.userData.languages ?? [],
                });
            }
        };

        fetchData();
    }, [user.email]);

    useEffect(() => {
            console.log("Updated userData:");
            console.log("Summary:", userData.summary);
            console.log("Previous Roles:", userData.prevRoles);
            console.log("Availability:", userData.avail);
            console.log("Certifications:", userData.certifications);
            console.log("Education:", userData.education);
            console.log("Skills:", userData.skills);
            console.log("Languages:", userData.languages);
    })

    const [editEntry, setEditEntry] = useState<keyof detailsDB | null>(null);
    const [visible, setVisible] = useState(true);
    //Dont forget to +1 for database
    //Instead of Editing I should look into delete + POST. No need for PUT
    //This one does the deletion
    const del = (field: keyof detailsDB, index: IntegerType) => {
        console.log(index)
        setEditEntry(field);
        setVisible(false);
    }

    //This one does the post
    //Temp = the input of the person
    const saveEntry = (field: keyof detailsDB) => {
        //appends the temp string to the userData.field??
        // setUserData((prev) => ({ ...prev, [field]: temp})); 
        
        //REST API POST

        setEditEntry(null);
        setVisible(true);
    }    

    //Same as saveEntry but no deleting occurs here.
    const createEntry = (field: keyof detailsDB) => {
        //appends the temp string to the userData.field??
        // setUserData((prev) => ({ ...prev, [field]: temp})); 
        setEditEntry(field);
        setVisible(false);
        //REST API POST
    }    

    

    return(
        <>
            <Header isLoggedIn={passwordValid} accountType={loginType}/>
            <div className="profile">
                <div className="userHeader">
                    <h1>Hello {name}</h1>
                    <p>Here you can update your details and see your messages</p>
                </div>
                {/* I could probably look to optimize this sometime but it works >.> */}
                <div className="details">
                    <div className="box1">
                        <div className="about">            
                            <h2>Summary</h2>
                            <p>{userData.summary !== "" ? (
                               userData.summary
                            ) : "Add your introduction here"}</p>
                            {editField === 'summary' ? (
                            <label>
                                <textarea
                                value={temp}
                                onChange={(e) => setTemp(e.target.value)}
                                placeholder="Enter your Summary"
                                />
                                <div className="save">
                                    <Button color="white" colorPalette="green" size="sm" p="4" onClick={() => save('summary')}>Save</Button>
                                </div>
                                <br/>
                            </label>
                            ) : (
                            <>
                                <Button color="green" colorPalette="green" variant="outline" size="xl" p="4" onClick={() => edit('summary')}>Edit Summary</Button>
                                <br/>
                            </>
                            )}

                        </div>
                        <div className="prevRoles">
                        <h2>Career History</h2>
                        {/* <p>{userData.prevRoles}</p> */}
                            {editField === 'prevRoles' ? (
                            <label>
                                <textarea
                                value={temp}
                                onChange={(e) => setTemp(e.target.value)}
                                placeholder="Enter your Career History"
                                />
                                <div className="save">
                                    <Button color="white" colorPalette="green" size="sm" p="4" onClick={() => save('prevRoles')}>Save</Button>
                                </div>
                                <br/>
                            </label>
                            ) : (
                            <>
                                <Button color="green" colorPalette="green" variant="outline" size="xl" p="4" onClick={() => edit('prevRoles')}>Edit Roles</Button>
                                <br/>
                            </>
                            )}
                        </div>
                        <h2>Education</h2>                        
                        <div className="education">
                        
                            {editField === 'education' ? (
                            <label>
                                <textarea
                                value={temp}
                                onChange={(e) => setTemp(e.target.value)}
                                placeholder="Enter your education"
                                />
                                <div className="save">
                                    <Button color="white" colorPalette="green" size="sm" p="4" onClick={() => save('education')}>Save</Button>
                                </div>
                                <br/>
                            </label>
                            ) : (
                            <>
                                <Button color="green" colorPalette="green" variant="outline" size="xl" p="4" onClick={() => edit('education')}>Edit Education</Button>
                                <br/>
                            </>
                            )}
                        </div>
                        <div className="skills">
                            <h2>Skills</h2>
                            
                            {editField === 'skills' ? (
                            <label>
                                <textarea
                                value={temp}
                                onChange={(e) => setTemp(e.target.value)}
                                placeholder="Enter your skills"
                                />
                                <div className="save">
                                    <Button color="white" colorPalette="green" size="sm" p="4" onClick={() => save('skills')}>Save</Button>
                                </div>
                                <br/>
                            </label>
                            ) : (
                            <>
                                <Button color="green" colorPalette="green" variant="outline" size="xl" p="4" onClick={() => edit('skills')}>Edit Skills</Button>
                                <br/>
                            </>
                            )}
                        </div>
                    </div>
                    <div className="box2">
                        <div className="cert">
                            <h2>Certifications</h2>
                            
                            {editField === 'certifications' ? (
                            <label>
                                <textarea
                                value={temp}
                                onChange={(e) => setTemp(e.target.value)}
                                placeholder="Enter your certifications"
                                />
                                <div className="save">
                                    <Button color="white" colorPalette="green" size="sm" p="4" onClick={() => save('certifications')}>Save</Button>
                                </div>
                                <br/>
                            </label>
                            ) : (
                            <>
                                <Button color="green" colorPalette="green" variant="outline" size="xl" p="4" onClick={() => edit('certifications')}>Edit certifications</Button>
                                <br/>
                            </>
                            )}
                            <hr className="divider"/>
                        </div>
                        <div className="avail">
                            <h2>Availability</h2>
                            <p>{userData.avail !== "" ? (
                               userData.avail
                            ) : "Add your introduction here"}</p>
                            {editField === 'avail' ? (
                            <label>
                                <textarea
                                value={temp}
                                onChange={(e) => setTemp(e.target.value)}
                                placeholder="Enter your availibility"
                                />
                                <div className="save">
                                    <Button color="white" colorPalette="green" size="sm" p="4" onClick={() => save('avail')}>Save</Button>
                                </div>
                                <br/>
                            </label>
                            ) : (
                            <>
                                <Button color="green" colorPalette="green" variant="outline" size="xl" p="4" onClick={() => edit('avail')}>Edit availibility</Button>
                                <br/>
                            </>
                            )}
                            <hr className="divider"/>
                        </div>
                        <div className="languages">
                            <h2>Languages</h2>

                            {userData.languages.length > 0 ? (
                            <>
                                <ul>
                                {userData.languages.map((obj, index) => (
                                    <li key={obj.language_key}> {obj.language} <Button color="green" colorPalette="white" size="xs" marginLeft="5" onClick={() => del('languages', index)}>
                                    <span className="material-symbols-outlined">edit</span></Button></li>
                                ))}
                                </ul>

                                {editEntry === 'languages' ? (
                                <label>
                                    <textarea
                                    value={temp}
                                    onChange={(e) => setTemp(e.target.value)}
                                    placeholder="Enter your language"
                                    />
                                    <div className="save">
                                        <Button color="white" colorPalette="green" size="sm" p="4" onClick={() => saveEntry('languages')}> Save </Button>
                                    </div>
                                    <br />
                                </label>
                                ) : ""}
                            </>
                            ) : (
                            <>
                                <p>No languages added yet.</p>
                            </>                            
                            )}
                            {visible && (
                            <Button color="white" colorPalette="green" size="sm" p="4" onClick={() => createEntry('languages')}>Add a language</Button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="comments">
                    <h2>Lecturer Comments:</h2><br/>
                    {/* if not comments... show you have no comments */}
                    <Comments/>
                </div>
            </div>
            <Footer isLoggedIn={passwordValid} type=""/>
        </>
    );
    
}
