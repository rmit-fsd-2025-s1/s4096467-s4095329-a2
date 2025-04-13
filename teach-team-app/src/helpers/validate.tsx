import bcrypt from "bcryptjs";
import { GiSummits } from "react-icons/gi";

export interface userState
{
    name?: string,
    email: string,
    password: string,
    role: string,
    classes?: string[]
    summary?: string[],
    prevRoles?: string[],
    avail?: string[],
    certifications?: string[],
    education?: string[],
    skills?: string[],
    languages?: string[],
}

export interface userCred
{
    email: string,
    password: string
}

export interface subject
{
    code: string,
    subjectName: string,
    candidates: string[]
    accepted: string[]
}

//TODO Minimum character. 1 upper case. 1 symbol

export function isPasswordValid(user: userCred)
{  
    return(getPasswordForUser(user));
}

export function getPasswordForUser({email, password}: userCred)
{
    // Populates the Map, this will be done with a DB later
    let db: Map<string, userState> = generateUsers();

    //If the name is found in the Map
    if(db.has(email))
    {
        const hashPass: string = db.get(email)?.password ?? "";
        return(bcrypt.compareSync(password, db.get(email)?.password||""));
    }
    else
    {
        return(false);
    }
}

//Returns whether the user is a lecturer, tutor or none
export function getUserType(email: string)
{
    // Populates the Map, this will be done with a DB later
    let db: Map<string, userState> = generateUsers();

    //If the name is found in the map
    if(db.has(email))
    {   //Return type
        return(db.get(email)?.role??"");
    }
    else
    {
        return "none";
    }
}

export function isLecturerForClass(email: string, classCode: string)
{
    let db: Map<string, userState> = generateUsers();

    if(db.has(email))
        {
            if(db.get(email)?.classes?.includes(classCode))
            {
                return true;
            }
        }
        return false;
}

export function getLectureClasses(email: string)
{
    let dbedu: Map<string, userState> = generateUsers();
    let dbsub: Map<string, subject> = generateSubjects();

    let lecturerClasses: subject[] = [];

    if(dbedu.has(email))
        {
            dbedu.get(email)?.classes?.forEach((subName) => {
                const classObj: subject | undefined = dbsub.get(subName);
                if (classObj) {
                    lecturerClasses.push(classObj);
                }
            })
        }

    return lecturerClasses;
}

export function getUserData(email:string) {
    const db: Map<string, userState> = generateUsers();

    if (!db.has(email)) {
        return null;
    }

    const userData = db.get(email);
    return {
        name: userData?.name ?? "",
        summary: userData?.summary ?? "",
        prevRoles: userData?.prevRoles ?? "",
        avail: userData?.avail ?? "",
        certifications: userData?.certifications ?? "",
        skills: userData?.skills ?? "",
        languages: userData?.languages ?? "",
        education: userData?.education ?? ""
    };
}

export function getCandidates(email: string) {
    // Get the subjects of the user
    let classes: subject[] = [];
    classes = getLectureClasses(email);

    // Then calculate candidates
    let cand = 0;
    for (let i of classes.values()) {
        cand += i.candidates.length;
    } 

    return cand;
}

export function getTutorCourses()
{
    let dbsub: Map<string, subject> = generateSubjects();
    let tutorCourses: subject[] = [];

            dbsub.forEach((courseObj) => {
                if (courseObj) {
                    tutorCourses.push(courseObj);
                }
            })

    return tutorCourses;
}

//Function to generate users, will use DB later
export function generateUsers()
{
    const user1: userState = 
    {
        name: "Robert",
        email: "test1@gmail.com",
        //Password1
        password: "$2b$10$skYNjqeufCqB25xbsyU0..B3Po4NytpQb3es47Khdxsynl/biPzXO",
        role: "tutor",
        summary: ["Hi I am robert I am an npc"],
        prevRoles: ["Started off as a gta 5 npc then went on to become an irl npc"],
        avail: ["Weekdays"],
        certifications: ["Cert III in guess who"],
        education: ["Masters degree in NPC arts"],
        skills: ["Npc walk\nBenched the solar system"],
        languages: ["bot language, ingwrish"],
    }

    const user4: userState = 
    {
        name: "Dorothy",
        email: "test2@gmail.com",
        //Password1
        password: "$2b$10$skYNjqeufCqB25xbsyU0..B3Po4NytpQb3es47Khdxsynl/biPzXO",
        role: "tutor",
        summary: [""],
        prevRoles: [""],
        avail: ["Part Time"],
        certifications: [""],
        education: [""],
        skills: [""],
        languages: [""],
    }

    const user5: userState = 
    {
        name: "Frank",
        email: "test3@gmail.com",
        //Password1
        password: "$2b$10$skYNjqeufCqB25xbsyU0..B3Po4NytpQb3es47Khdxsynl/biPzXO",
        role: "tutor",
        summary: [""],
        prevRoles: [""],
        avail: ["Full Time"],
        certifications: [""],
        education: [""],
        skills: [""],
        languages: [""],
    }

    const user2: userState = 
    {
        name: "Connor",
        email: "connor@gmail.com",
        //P@ssword1
        password: "$2b$10$8C6C.0Ph4SljkgQchNCxuu/BaMwziIA3Uz66S/5rciwtUJflURPlK",
        role: "lecturer",
        classes: ["COSC1121", "COSC1122", "COSC1123"]
    }

    const user3: userState = 
    {
        name: "Will",
        email: "will@gmail.com",
        //P@ssword2
        password: "$2b$10$IVaJqtZuG1oo6xj2lHi/4.20ZWCbYWPgtqA7r0.aBKrxvF699.skq",
        role: "lecturer",
        classes: ["COSC1124", "COSC1125", "COSC1126"]
    }

    let returnMap = new Map<string, userState>();

    returnMap.set("test1@gmail.com", user1);
    returnMap.set("connor@gmail.com", user2);
    returnMap.set("will@gmail.com", user3);
    returnMap.set("test2@gmail.com", user4);
    returnMap.set("test3@gmail.com", user5);

    return returnMap;
}

export function generateSubjects()
{
    const subject1: subject =
    {
        code:"COSC1121",
        subjectName: "Database Applications",
        candidates: ["test1@gmail.com", "test2@gmail.com"],
        accepted: []
    }

    const subject2: subject =
    {
        code:"COSC1122",
        subjectName: "Database Applesandorangus",
        candidates: ["test1@gmail.com", "test3@gmail.com"],
        accepted: []
    }

    const subject3: subject =
    {
        code:"COSC1123",
        subjectName: "Database Applicashuns",
        candidates: ["test2@gmail.com", "test3@gmail.com"],
        accepted: []
    }

    const subject4: subject =
    {
        code:"COSC1124",
        subjectName: "Jartabase Applicarter",
        candidates: ["test2@gmail.com", "test3@gmail.com"],
        accepted: []
    }

    const subject5: subject =
    {
        code:"COSC1125",
        subjectName: "Excelspreadsheet Macrocations",
        candidates: ["test2@gmail.com", "test3@gmail.com"],
        accepted: []
    }

    const subject6: subject =
    {
        code:"COSC1126",
        subjectName: "Gumtree Cat Management",
        candidates: ["test2@gmail.com", "test3@gmail.com"],
        accepted: []
    }

    let returnMap = new Map<string, subject>();
    returnMap.set("COSC1121", subject1);
    returnMap.set("COSC1122", subject2);
    returnMap.set("COSC1123", subject3);
    returnMap.set("COSC1124", subject4);
    returnMap.set("COSC1125", subject5);
    returnMap.set("COSC1126", subject6);
    
    return(returnMap);
}