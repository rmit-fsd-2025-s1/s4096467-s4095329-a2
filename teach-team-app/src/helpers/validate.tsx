import bcrypt from "bcryptjs";
import { userApi } from "../services/api";

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

export interface User
{
    email: string,
    full_name: string,
    password: string,
    role: string,
    availability: string,
    summary: string,
    active: boolean,
    certifications: string[],
    educations: string[],
    languages: string[],
    previous_roles: string[],
    skills: string[]
}

export interface classTable
{
    tutorApplicants: User[],
    tutorAccepted: User[],
    labApplicants: User[],
    labAccepted: User[],
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
    const checkUser = async () =>
        {
            try
            {
                const result: boolean = await userApi.checkLogin(user.email,user.password);
                return result;
            }
            catch(e)
            {
                return false;
            }
        }
    return checkUser();
    // return(getPasswordForUser(user));
}

//Returns whether the user is a lecturer, tutor or none
export function getUserType(email: string)
{
    const getUserType = async () =>
        {
            try
            {
                const result: string = await userApi.getType(email);
                return result;
            }
            catch(e)
            {
                return "";
            }
        }
    return getUserType();
}

export function isLecturerForClass(email: string, classCode: string)
{
    const checkUser = async () =>
        {
            try
            {
                const result: boolean = await userApi.isLecturingClass(email,classCode);
                return result;
            }
            catch(e)
            {
                return false;
            }
        }
    return checkUser();
}

export function getLectureClasses(email: string)
{
    const dbedu: Map<string, userState> = generateUsers();
    const dbsub: Map<string, subject> = generateSubjects();

    const lecturerClasses: subject[] = [];

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
    for (const i of classes.values()) {
        cand += i.candidates.length;
    } 

    return cand;
}

export function getTutorCourses()
{
    const dbsub: Map<string, subject> = generateSubjects();
    const tutorCourses: subject[] = [];

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
        summary: ["Hi I am robert, I study aerospace engineering"],
        prevRoles: ["Intern at tesla for 1 year"],
        avail: ["Weekdays"],
        certifications: ["Bachelors Degree in aerospace engineering"],
        education: ["University of Melbounre"],
        skills: ["Adaptable"],
        languages: ["English, Spanish"],
    }

    const user4: userState = 
    {
        name: "Dorothy",
        email: "test2@gmail.com",
        //Password1
        password: "$2b$10$skYNjqeufCqB25xbsyU0..B3Po4NytpQb3es47Khdxsynl/biPzXO",
        role: "tutor",
        summary: ["I am Dorothy I am 20 years old"],
        prevRoles: ["None"],
        avail: ["Part Time"],
        certifications: ["Bachelors Degree in Education"],
        education: ["University of Victoria"],
        skills: ["Hard-Working"],
        languages: ["English"],
    }

    const user5: userState = 
    {
        name: "Frank",
        email: "test3@gmail.com",
        //Password1
        password: "$2b$10$skYNjqeufCqB25xbsyU0..B3Po4NytpQb3es47Khdxsynl/biPzXO",
        role: "tutor",
        summary: ["Hello, I am Frank, I like programming"],
        prevRoles: ["Intern at Microsoft"],
        avail: ["Full Time"],
        certifications: ["Masters Degress in computer science"],
        education: ["RMIT"],
        skills: ["God at Leetcode"],
        languages: ["English, C++, Chinese"],
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

    const returnMap = new Map<string, userState>();

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
        subjectName: "Data Science",
        candidates: ["test1@gmail.com", "test3@gmail.com"],
        accepted: []
    }

    const subject3: subject =
    {
        code:"COSC1123",
        subjectName: "Programming bootcamp 1",
        candidates: ["test2@gmail.com", "test3@gmail.com"],
        accepted: []
    }

    const subject4: subject =
    {
        code:"COSC1124",
        subjectName: "Business and Finance",
        candidates: ["test2@gmail.com", "test3@gmail.com"],
        accepted: []
    }

    const subject5: subject =
    {
        code:"COSC1125",
        subjectName: "Excelspreadsheet manager",
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

    const returnMap = new Map<string, subject>();
    returnMap.set("COSC1121", subject1);
    returnMap.set("COSC1122", subject2);
    returnMap.set("COSC1123", subject3);
    returnMap.set("COSC1124", subject4);
    returnMap.set("COSC1125", subject5);
    returnMap.set("COSC1126", subject6);
    
    return(returnMap);
}