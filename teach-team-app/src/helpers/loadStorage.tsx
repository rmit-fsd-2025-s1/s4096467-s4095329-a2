import { useLocalStorage } from "@/hooks/useLocalStorage";
import { userState, subject, generateSubjects, generateUsers } from "@/helpers/validate";

export interface localDBInt
{
    users: [string, userState][],
    subjects: [string, subject][]
}

export function loadDB(): localDBInt
{
    const userData: [string, userState][] = Array.from(generateUsers());
    const subjectData: [string, subject][] = Array.from(generateSubjects());
    console.log("dingus");
    console.log(userData);
    console.log(subjectData);
    let localStorageBD: localDBInt = {users: userData, subjects: subjectData};
    return localStorageBD;
}