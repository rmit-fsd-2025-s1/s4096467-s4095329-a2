import { localDBInt } from "./loadStorage";
import { generateUsers, userState } from "./validate";

export function getCandidatesFrom(subject: string, localDB: localDBInt): userState[]
{
    let tutors: userState[] = [];
    let dbTut: Map<string, userState> = generateUsers();

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
    let dbTut: Map<string, userState> = generateUsers();

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