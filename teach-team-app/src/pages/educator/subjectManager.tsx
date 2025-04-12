import {Header} from "../../components/Header/Header";
import {Footer} from "../../components/Footer/Footer";
import { LoadingScreen } from "@/components/LoadingScreen/LoadingScreen";
import {HomeContent} from "../../components/Home/Home";
import { isPasswordValid, userCred, getPasswordForUser, getUserType, isLecturerForClass, generateSubjects, userState, subject, generateUsers, getUserData} from "../../helpers/validate";
import { useRouter } from 'next/router';
import { Button, For, LocaleProvider, Stack, Table } from "@chakra-ui/react";

import "./subjectManager.css";
import { useEffect, useState , useMemo} from "react";
import { InvalidLogin } from "@/components/InvalidLogin/InvalidLogin";
import { TutorSubjectTable, dualTableProps } from "@/components/SortingTable/SortingTable";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { loadDB, localDBInt } from "@/helpers/loadStorage";
import { useIfLocalStorage } from "@/hooks/useIfLocalStorage";
import { TutorSubjectTableSort} from "@/components/SortingTable/SortingTableOrder";
import { getAcceptedFrom, getCandidatesFrom } from "@/helpers/localStorageGet";

export default function subjectManager()
{
    //Set up state hooks
    const[localEmail, setLocalEmail] = useState<string>("");
    const[localPassword, setLocalPassword] = useState<string>("");
    //Set up Router / get subject name
    const router = useRouter();
    //Thank you https://www.reddit.com/r/nextjs/comments/nb4jju/check_if_routerqueryparam_is_string_or_string/
    const subject = Array.isArray(router.query.data) ? router.query.data[0] : router.query.data;
    
    //Pull from localStorage
    useEffect(() => 
    {
        setLocalEmail(localStorage.getItem("localEmail")||"");
        setLocalPassword(localStorage.getItem("localPassword")||"");
    }, []);
    
    //Password Checking
    //Same optimization as userProfile
    const user: userCred = useMemo(() => ({
        email: localEmail,
        password: localPassword
    }), [localEmail, localPassword]);
    const passwordValid = useMemo(() => isPasswordValid(user), [user]);
    const loginType = useMemo(() => getUserType(user.email), [user.email]);
    let content;

    //Pull sample values
    let dbTut: Map<string, userState> = generateUsers();

    //Create hooks to update the tables
    const[localDB, setLocalDB] = useIfLocalStorage("localDB", loadDB());
    
    //Create tutors array
    let tutors: userState[] = getCandidatesFrom(subject??"", localDB);

    //Create tutors array
    let acceptedUser: userState[] = getAcceptedFrom(subject??"", localDB);

    //Setup hooks for each table list
    const[candidateList, setCandidateList] = useLocalStorage<userState[]>("tempCandidateList", tutors);
    const[selectedList, setSelectedList] = useLocalStorage<userState[]>("tempSelectedList", acceptedUser);

    // Save List to LocalStorage. This will be replaced with A DB function later
    function saveChanges()
    {
        let tempDB:localDBInt = { ...localDB };

        // Setting accepted and candidate tutors using type/javascript spaghetti 
        let acceptedTutor: string[] = selectedList.map(a=>a.email);
        let candidateTutor: string[] = candidateList.map(a=>a.email);
        
        // Set the value of the subject accepted
        tempDB.subjects.filter((subjectKeyPair) => subjectKeyPair[0] === subject)[0][1].accepted = acceptedTutor;
        // Set the value of the subject candidates
        tempDB.subjects.filter((subjectKeyPair) => subjectKeyPair[0] === subject)[0][1].candidates = candidateTutor;
        
        // Save to localStorage
        setLocalDB(tempDB);

        // console.log(acceptedTutor);
        // console.log(candidateTutor);
    }

    //Same logic as in the user profile
    const [commentEmail, setCommentEmail] = useState<string | null>(null);
    const [temp, setTemp] = useState("");
    const comment = (email: string) => {
        setCommentEmail(email);
        setTemp("");
    }
    
    const send = (email: string, sender: string) => {
        const sendTo = `${email}_commentFrom_${sender}`; 
        localStorage.setItem(sendTo, temp);
        setCommentEmail(null);
    }

    //Generate content based on logged in status
    if(passwordValid && (getUserType(localEmail) === "lecturer") && isLecturerForClass(localEmail, subject??""))
        {
            content = <>
                <div className="pick-tutor-container">
                    <div className="subjectName">
                        {subject}
                    </div>
                    <div className="subMflex-sbs-subM">
                        {/* Generate left table */}
                        <h3>Select your candidates</h3>
                        <TutorSubjectTable table1={candidateList} table2={selectedList} setTable1={setCandidateList} setTable2={setSelectedList}/>
                        {/* Generate right table */}
                        <h3>Accepted candidates</h3>
                        <TutorSubjectTableSort table2={candidateList} table1={selectedList} setTable2={setCandidateList} setTable1={setSelectedList}/>
                    </div>
                    <div className="save-button">
                        <Button colorPalette={"green"} p="4" onClick={saveChanges}>Save Changes</Button>
                    </div>
                    <div className="comment-container">
                    <div className="ft">
                        <h3>Comment Candidates</h3>
                    </div>
                        {selectedList.length > 0 ? (
                            <div className="comment-box">
                                <ul>
                                    {selectedList.map((user) => (
                                        <li key={user.email}>{user.name ?? user.email}
                                        {commentEmail !== user.email ? (
                                            <Button p="4" size="lg" colorPalette="green" variant="outline" onClick={() => comment(user.email)}>Comment</Button>
                                        ) : (
                                            <>
                                            <label>
                                                <textarea
                                                    value={temp}
                                                    onChange={(e) => setTemp(e.target.value)}
                                                    placeholder="Comment your thoughts"
                                                />
                                            </label>
                                            <Button p="4" size="lg" colorPalette="green" variant="outline" onClick={() => send(user.email, localEmail)}>Send</Button>
                                            </>
                                        )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p>No candidates have been accepted yet.</p>
                        )}
                    </div>
                </div>
            </>
            ;
        }
        else
        {
            content = <LoadingScreen/>
        }

    return(
        <>
            <title>Class Name Here</title>
            <Header isLoggedIn={passwordValid} accountType={loginType}/>
            {content}
            <Footer isLoggedIn={passwordValid} type=""/>
        </>
    );
    
}