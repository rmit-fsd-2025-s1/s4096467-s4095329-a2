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

interface Certification {
    certification_key: number;
    certification: string; 
}

interface Skills {
    skill_key: number;
    skill: string;
}

interface Education {
    education_key: number;
    education: string;
}

interface PreviousRoles {
    role_key: number;
    prev_role: string;
}

export interface detailsDB {
    summary: string;
    previous_roles: PreviousRoles[];
    avail: string;
    certifications: Certification[];
    educations: Education[];
    skills: Skills[];
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
        previous_roles: [],
        avail: "",
        certifications: [],
        educations: [],
        skills: [],
        languages: [],
    });

    //Definitely Can optimize this
    const [saved, setSaved] = useState(false);
    //Basically this prevents undefined behaviour if some synchronous or asynchronous shenanigans happens
    
    //Some janky stuff happening here
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
                    previous_roles: getdata.userData.previous_roles ?? [],
                    avail: getdata.userData.availability ?? "",
                    certifications: getdata.userData.certifications ?? [],
                    educations: getdata.userData.educations ?? [],
                    skills: getdata.userData.skills ?? [],
                    languages: getdata.userData.languages ?? [],
                });
            }

            setSaved(false);
        };

        fetchData();
    }, [user.email, saved]);

    useEffect(() => {
            // console.log("Updated userData:");
            // console.log("Summary:", userData.summary);
            // console.log("Previous Roles:", userData.previous_roles);
            // console.log("Availability:", userData.avail);
            // console.log("Certifications:", userData.certifications);
            // console.log("Education:", userData.education);
            // console.log("Skills:", userData.skills);
            // console.log("Languages:", userData.languages);
            // console.log("Previous Roles:", JSON.stringify(userData.previous_roles, null, 2));
    })

    const [editEntry, setEditEntry] = useState<keyof detailsDB | null>(null);

    //This one does the deletion
    const del = (field: keyof detailsDB, key: number) => {
        setEditEntry(field);
        const c = rem(field, key)
    }

    const rem = (field: keyof detailsDB, key: number) => {
        const b = deleteField(field, key, user.email)
        setSaved(true);
        
    }

    // console.log(index)
    //This one does the post
    //Temp = the input of the person
    const saveEntry = (field: keyof detailsDB) => {
        //appends the temp string to the userData.field??
        // setUserData((prev) => ({ ...prev, [field]: temp})); 
        
        //REST API POST
        setSaved(true);
        if (!temp.trim()) {
            console.warn("Empty input. Skipping creation.");
            setEditEntry(null);
            return;
        }   

        const a = postField(field, temp, user.email);
        setEditEntry(null);
        setTemp("")
    }    

    const createEntry = (field: keyof detailsDB) => {
        setEditEntry(field);
        setTemp("")
    }    

    //TODO ADD SOME BUG FIXING. FIX SUMMARY AND AVAILABILITY

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
                        {userData.previous_roles.length > 0 ? (
                            <>
                                <ul>
                                {/*Naming conventiosn HAVE to be the same as the DB or else it wont work. Its because you are getting RAW entities from the DB with exact naming*/}
                                {userData.previous_roles.map((obj, index) => (
                                    <li key={obj.role_key}> {obj.prev_role} <Button color="green" colorPalette="white" size="xs" marginLeft="5" onClick={() => del('previous_roles', obj.role_key)}>
                                    <span className="material-symbols-outlined">edit</span></Button>
                                    <Button color="red" colorPalette="white" size="xs" onClick={() => rem('previous_roles', obj.role_key)}>
                                    <span className="material-symbols-outlined">close</span></Button>
                                    </li>
                                ))}
                                </ul>
                            </>
                            ) : (
                            <>
                                <p>No previous roles added yet.</p>
                            </>                            
                            )}
                            {editEntry === 'previous_roles' ? (
                                <label>
                                    <textarea
                                    value={temp}
                                    onChange={(e) => setTemp(e.target.value)}
                                    placeholder="Enter your previous roles"
                                    />
                                    <div className="save">
                                        <Button color="white" colorPalette="green" size="sm" p="4" onClick={() => saveEntry('previous_roles')}> Save </Button>
                                    </div>
                                    <br />
                                </label>
                                ) : ""}
                            <Button color="white" colorPalette="green" size="sm" p="4" onClick={() => createEntry('previous_roles')}>Add previous role</Button>
                        </div>
                        <h2>Education</h2>                        
                        <div className="education">
                        {userData.educations.length > 0 ? (
                            <>
                                <ul>
                                {userData.educations.map((obj, index) => (
                                    <li key={obj.education_key}> {obj.education} <Button color="green" colorPalette="white" size="xs" marginLeft="5" onClick={() => del('educations', obj.education_key)}>
                                    <span className="material-symbols-outlined">edit</span></Button>
                                    <Button color="red" colorPalette="white" size="xs" onClick={() => rem('educations', obj.education_key)}>
                                    <span className="material-symbols-outlined">close</span></Button></li>
                                ))}
                                </ul>
                            </>
                            ) : (
                            <>
                                <p>No education added yet.</p>
                            </>                            
                            )}
                            {editEntry === 'educations' ? (
                                <label>
                                    <textarea
                                    value={temp}
                                    onChange={(e) => setTemp(e.target.value)}
                                    placeholder="Enter your education"
                                    />
                                    <div className="save">
                                        <Button color="white" colorPalette="green" size="sm" p="4" onClick={() => saveEntry('educations')}> Save </Button>
                                    </div>
                                    <br />
                                </label>
                                ) : ""}
                            <Button color="white" colorPalette="green" size="sm" p="4" onClick={() => createEntry('educations')}>Add education</Button>
                        </div>
                        <div className="skills">
                            <h2>Skills</h2>
                            {userData.skills.length > 0 ? (
                            <>
                                <ul>
                                {userData.skills.map((obj, index) => (
                                    <li key={obj.skill_key}> {obj.skill} <Button color="green" colorPalette="white" size="xs" marginLeft="5" onClick={() => del('skills', obj.skill_key)}>
                                    <span className="material-symbols-outlined">edit</span></Button>
                                    <Button color="red" colorPalette="white" size="xs" onClick={() => rem('skills', obj.skill_key)}>
                                    <span className="material-symbols-outlined">close</span></Button></li>
                                ))}
                                </ul>
                            </>
                            ) : (
                            <>
                                <p>No skills added yet.</p>
                            </>                            
                            )}
                            {editEntry === 'skills' ? (
                                <label>
                                    <textarea
                                    value={temp}
                                    onChange={(e) => setTemp(e.target.value)}
                                    placeholder="Enter your skills"
                                    />
                                    <div className="save">
                                        <Button color="white" colorPalette="green" size="sm" p="4" onClick={() => saveEntry('skills')}> Save </Button>
                                    </div>
                                    <br />
                                </label>
                                ) : ""}
                            <Button color="white" colorPalette="green" size="sm" p="4" onClick={() => createEntry('skills')}>Add skills</Button>
                        </div>
                    </div>
                    <div className="box2">
                        <div className="cert">
                            <h2>Certifications</h2>
                            {userData.certifications.length > 0 ? (
                            <>
                                <ul>
                                {userData.certifications.map((obj, index) => (
                                    <li key={obj.certification_key}> {obj.certification} 
                                    <Button color="green" colorPalette="white" size="xs" marginLeft="5" onClick={() => del('certifications', obj.certification_key)}>
                                    <span className="material-symbols-outlined">edit</span></Button>
                                    <Button color="red" colorPalette="white" size="xs" onClick={() => rem('certifications', obj.certification_key)}>
                                    <span className="material-symbols-outlined">close</span></Button></li>
                                ))}
                                </ul>
                            </>
                            ) : (
                            <>
                                <p>No certifications added yet.</p>
                            </>
                            )}                               
                            {editEntry === 'certifications' ? (
                                <label>
                                    <textarea
                                    value={temp}
                                    onChange={(e) => setTemp(e.target.value)}
                                    placeholder="Enter your certifications"
                                    />
                                    <div className="save">
                                        <Button color="white" colorPalette="green" size="sm" p="4" onClick={() => saveEntry('certifications')}> Save </Button>
                                    </div>
                                    <br />
                                </label>
                                ) : ""}
                            <Button color="white" colorPalette="green" size="sm" p="4" onClick={() => createEntry('certifications')}>Add a certification</Button>
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
                                    <li key={obj.language_key}> {obj.language} <Button color="green" colorPalette="white" size="xs" marginLeft="5" onClick={() => del('languages', obj.language_key)}>
                                    <span className="material-symbols-outlined">edit</span></Button>
                                    <Button color="red" colorPalette="white" size="xs" onClick={() => rem('languages', obj.language_key)}>
                                    <span className="material-symbols-outlined">close</span></Button></li>
                                ))}
                                </ul>
                            </>
                            ) : (
                            <>
                                <p>No languages added yet.</p>
                            </>                            
                            )}
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
                            <Button color="white" colorPalette="green" size="sm" p="4" onClick={() => createEntry('languages')}>Add a language</Button>
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
