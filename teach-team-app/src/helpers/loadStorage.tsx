import { useLocalStorage } from "@/hooks/useLocalStorage";
import { userState, subject, generateSubjects, generateUsers } from "@/helpers/validate";

export interface localDBInt
{
    users: Map<string, userState>,
    subjects: Map<string, subject>
}

export function loadDB()
{
    let localStorageBD: localDBInt = {users: generateUsers(), subjects: generateSubjects()};
    const [localDB, setLocalDB] = useLocalStorage("localDB", localStorageBD);
}