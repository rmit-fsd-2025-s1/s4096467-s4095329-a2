import { localDBInt } from "./loadStorage";
import { generateUsers, subject, userState } from "./validate";

// Returns tutors that have applied to the desired subject
export function getCandidatesFrom(subject: string, localDB: localDBInt): userState[]
{
    const tutors: userState[] = [];
    const dbTut: Map<string, userState> = new Map(localDB.users.map((kp) => [kp[0], kp[1]]))??generateUsers();

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

// Returns tutors that have been accepted from the desired subject
export function getAcceptedFrom(subject: string, localDB: localDBInt): userState[]
{
    const tutors: userState[] = [];
    const dbTut: Map<string, userState> = new Map(localDB.users.map((kp) => [kp[0], kp[1]]))??generateUsers();

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

// Returns the classes a lecturer is assigned to
export function getEducatorClasses(email: string, localClasses: [string, subject][]): subject[]
{
    const dbUsers: Map<string, userState> = generateUsers();
    const formattedMap: Map<string, subject> = new Map(localClasses.map((obj) => [obj[0], obj[1]]));
    const lecturerClasses: subject[] = [];

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

// Gets the number of candidates total for the inputted lecturer
export function getLocalCandidates(email: string, localClasses: [string, subject][]): number
{
    // Get the subjects of the user
    let classes: subject[] = [];
    classes = getEducatorClasses(email, localClasses);

    // Then calculate candidates
    let cand = 0;
    for (const i of classes.values()) {
        cand += i.candidates.length;
    } 

    return cand;
}

// Gets the class names that a tutor has submitted to
export function getAppliedCourses(email: string, localClasses: subject[]): string[]
{
    const courses: string[] = [];

    localClasses.forEach((e)=>{
        e.candidates.forEach((c)=>{
            if(c === email) {
                courses.push(e.subjectName + " - " + e.code);
            }
        })
    });

    return courses;
}

// Gets the class names that a tutor has been accepted for
export function getAcceptedCourses(email: string, localClasses: subject[]): string[]
{
    const courses: string[] = [];

    localClasses.forEach((e)=>{
        e.accepted.forEach((c)=>{
            if(c === email) {
                courses.push(e.subjectName + " - " + e.code);
            }
        })
    });

    return courses;
}

// Returns number of classes a Tutor is currently accepted for
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

// Returns a tutor's application status for an inputted subject
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

export function getUser(user: string, db: localDBInt): userState|undefined
{
    const dbTut: Map<string, userState> = new Map(db.users.map((kp) => [kp[0], kp[1]]))??generateUsers();

    return dbTut.get(user);
}