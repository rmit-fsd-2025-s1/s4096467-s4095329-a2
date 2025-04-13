import { userState, subject, generateSubjects, generateUsers, getTutorCourses } from "@/helpers/validate";
import { useEffect, useState } from "react";

// Interface to represent the "Database" used in localstorage
export interface localDBInt
{
    users: [string, userState][],
    subjects: [string, subject][]
}

export interface applications {
    tutor: string;
    app: string;
}

// Loads the sample data into the localDBInt type and returns it to populate the localStorage
export function loadDB(): localDBInt
{   
    // let db: Map<string, userState> = generateUsers();
    // const [application, setApplication] = useState<applications[]>([]);
    
    // useEffect(() => {
    //     const listOfTutors: string[] = [];
    //     const foundApplications: applications[] = [];
    //     const tutorCourses = getTutorCourses();
    
    //     // Get all tutors from the database
    //     for (const [email, user] of db) {
    //         if (user.role === "tutor") {
    //             listOfTutors.push(user.email);
    //         }
    //     }

    //     console.log("Tutors list", listOfTutors)
    //     console.log("Tutor courses", tutorCourses)
    //     //Loops search courses
    //     tutorCourses.forEach((course) => {
    //         const subjectCode = course.code;
    //         //check candidates for each course
    //         course.candidates.forEach((candidate) => {
    //             //Local storage key
    //             const applied = localStorage.getItem(`${candidate}_appliedTo_${subjectCode}`);
    //             //When found add it to found applications
    //             if (applied === "true") {
    //                 foundApplications.push({
    //                     tutor: candidate, // Or maybe use 'candidate' as a field name instead
    //                     app: subjectCode
    //                 });
    //             }
    //         });
    //     });

    //     console.log("foundApplications", foundApplications)

    //     setApplication(foundApplications);
    // }, []);

    // ___________________________________
    const userData: [string, userState][] = Array.from(generateUsers());
    const subjectData: [string, subject][] = Array.from(generateSubjects());    
    let localStorageBD: localDBInt = {users: userData, subjects: subjectData};

    console.log("local storage BD", localStorageBD)

    return localStorageBD;
}