import { userState, subject, generateSubjects, generateUsers } from "@/helpers/validate";

// Interface to represent the "Database" used in localstorage
export interface localDBInt
{
    users: [string, userState][],
    subjects: [string, subject][]
}

// Loads the sample data into the localDBInt type and returns it to populate the localStorage
export function loadDB(): localDBInt
{
    const userData: [string, userState][] = Array.from(generateUsers());
    const subjectData: [string, subject][] = Array.from(generateSubjects());
    let localStorageBD: localDBInt = {users: userData, subjects: subjectData};
    return localStorageBD;
}