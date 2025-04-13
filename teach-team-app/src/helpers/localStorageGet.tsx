import { localDBInt } from "./loadStorage";
import { generateUsers, subject, userState } from "./validate";

export function getCandidatesFrom(subject: string, localDB: localDBInt): userState[]
{
    let tutors: userState[] = [];
    let dbTut: Map<string, userState> = new Map(localDB.users.map((kp) => [kp[0], kp[1]]))??generateUsers();

    //https://medium.com/codingbeauty-tutorials/javascript-convert-array-to-map-12907a8a334a
    if(new Map(localDB.subjects.map((obj) => [obj[0], obj[1]])).has(subject??""))
        {
            localDB.subjects.filter((subjectKeyPair) => subjectKeyPair[0] === subject)[0][1]?.candidates.forEach((it) => {
                const tutor: userState | undefined = dbTut.get(it);
                if (tutor) {
                    tutors.push(tutor);
                }
            })
        }

    return tutors;
}

export function getAcceptedFrom(subject: string, localDB: localDBInt): userState[]
{
    let tutors: userState[] = [];
    let dbTut: Map<string, userState> = new Map(localDB.users.map((kp) => [kp[0], kp[1]]))??generateUsers();

    //https://medium.com/codingbeauty-tutorials/javascript-convert-array-to-map-12907a8a334a
    if(new Map(localDB.subjects.map((obj) => [obj[0], obj[1]])).has(subject??""))
        {
            localDB.subjects.filter((subjectKeyPair) => subjectKeyPair[0] === subject)[0][1]?.accepted.forEach((it) => {
                const tutor: userState | undefined = dbTut.get(it);
                if (tutor) {
                    tutors.push(tutor);
                }
            })
        }

    return tutors;
}

export function getEducatorClasses(email: string, localClasses: [string, subject][]): subject[]
{
    let dbUsers: Map<string, userState> = generateUsers();
    let formattedMap: Map<string, subject> = new Map(localClasses.map((obj) => [obj[0], obj[1]]));
    let lecturerClasses: subject[] = [];

    if(dbUsers.has(email))
        {
            dbUsers.get(email)?.classes?.forEach((subName) => {
                const classObj: subject | undefined = formattedMap.get(subName);
                if (classObj) {
                    lecturerClasses.push(classObj);
                }
            })
        }
    
    return lecturerClasses;
}

export function getLocalCandidates(email: string, localClasses: [string, subject][]): number
{
    // Get the subjects of the user
    let classes: subject[] = [];
    classes = getEducatorClasses(email, localClasses);

    // Then calculate candidates
    let cand = 0;
    for (let i of classes.values()) {
        cand += i.candidates.length;
    } 

    return cand;
}

export function getAppliedCourses(email: string, localClasses: subject[]): string[]
{
    let courses: string[] = [];

    localClasses.forEach((e)=>{
        e.candidates.forEach((c)=>{
            if(c === email) {
                courses.push(e.code);
            }
        })
    });

    return courses;
}

export function getAcceptedCourses(email: string, localClasses: subject[]): string[]
{
    let courses: string[] = [];

    localClasses.forEach((e)=>{
        e.accepted.forEach((c)=>{
            if(c === email) {
                courses.push(e.code);
            }
        })
    });

    return courses;
}

export function getAcceptedCount(email: string, localClasses: subject[]): number
{
    let countVal: number = 0;

    localClasses.forEach((e)=>{
        e.accepted.forEach((c)=>{
            if(c === email) {
                countVal++;
            }
        })
    });

    return countVal;
}

export function applicationStatus(subject: subject, tutor: string): string
{
    let outcome: string = "Not Applied";

    if(subject.candidates.includes(tutor))
        {
            outcome = "Applied";
        }

    if(subject.accepted.includes(tutor))
        {
            outcome = "Accepted";
        }

    return outcome;
}