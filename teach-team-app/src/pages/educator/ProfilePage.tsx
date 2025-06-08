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
import { useRouter } from "next/router";
import "./ProfilePage.css";

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

export interface info {
    email: string,
    role: string,
    full_name: string;
    summary: string;
    previous_roles: PreviousRoles[];
    availability: string;
    certifications: Certification[];
    educations: Education[];
    skills: Skills[];
    languages: Language[];
}

export default function ProfilePage() {
    const router = useRouter();
    const email = Array.isArray(router.query.email) ? router.query.email[0] : router.query.email;
    
    console.log("EMAIL", email)
    
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
        const runOnShow = () => {
            const getTypeVal = async () => {
                console.log(user.email)
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
        }
        runOnShow();
    }, [user]);

    const getDetails = async () => {
        if (email !== undefined) {
            console.log("GET CALLED")
            const getdata = await getUser(email)
            if (getdata && getdata.userData) {
                setUserData({
                    email: getdata.userData.email ?? "",
                    role: getdata.userData.role ?? "",
                    full_name: getdata.userData.full_name ?? "",
                    summary: getdata.userData.summary ?? "",
                    previous_roles: getdata.userData.previous_roles ?? [],
                    availability: getdata.userData.availability ?? "",
                    certifications: getdata.userData.certifications ?? [],
                    educations: getdata.userData.educations ?? [],
                    skills: getdata.userData.skills ?? [],
                    languages: getdata.userData.languages ?? [],
                });
            }
            console.log(getdata)
        }
    }

    useEffect(() => {
       getDetails(); 
    }, [email])

    const [userData, setUserData] = useState<info>({
        email: "",
        role: "",
        full_name: "",
        summary: "",
        previous_roles: [],
        availability: "",
        certifications: [],
        educations: [],
        skills: [],
        languages: [],
    });

    return (
        <>
        <Header isLoggedIn={passwordValid} accountType={loginType}/>
        <div className="profileBody">
            <div className="profHeader"><h1>{userData.full_name}'s Profile</h1></div>

            <h1>Email: {userData.email}
            <br/>Role: {userData.role}</h1>
            <br/>

            <h1>Summary</h1>
            <div className="font">
                {userData.summary || "No summary provided."}
            </div>

            <h1>Availability</h1>
            <div className="font">
                {userData.availability || "No availability provided."}
            </div>

            <h1>Career History</h1>
            <div className="font">
                {userData.previous_roles.length > 0 ? (
                    <ul>{userData.previous_roles.map((obj) => (
                        <li key={obj.role_key}>{obj.prev_role}</li>
                    ))}</ul>
                ) : (
                    <div>No previous roles listed.</div>
                )}
            </div>

            <h1>Certifications:</h1>
            <div className="font">
                {userData.certifications.length > 0 ? (
                    <ul>{userData.certifications.map((obj) => (
                        <li key={obj.certification_key}> {obj.certification} </li>
                    ))}</ul>
                ) : (
                    <div>No certifications provided.</div>
                )}
            </div>

            <h1>Educations</h1>
            <div className="font">
                {userData.educations.length > 0 ? (
                    <ul>{userData.educations.map((obj) => (
                        <li key={obj.education_key}> {obj.education} </li>
                    ))}</ul>
                ) : (
                    <div>No education history provided.</div>
                )}
            </div>

            <h1>Languages</h1>
            <div className="font">
                {userData.languages.length > 0 ? (
                    <ul>{userData.languages.map((obj) => (
                        <li key={obj.language_key}>{obj.language}</li>
                    ))}</ul>
                ) : (
                    <div>No languages listed.</div>
                )}
            </div>

            <h1>Skills</h1>
            <div className="font">
                {userData.skills.length > 0 ? (
                    <ul>
                        {userData.skills.map((obj) => (
                            <li key={obj.skill_key}>{obj.skill}</li>
                        ))}
                    </ul>
                ) : (
                    <div>No skills listed.</div>
                )}
            </div>
        </div>
        {loginType !== "lecturer" && loginType !== "candidate" && (
            <LoadingScreen/>
        )}
        <Footer isLoggedIn={passwordValid} type=""/>
        </>
    );
}