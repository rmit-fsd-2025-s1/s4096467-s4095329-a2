import {Header} from "../../components/Header/Header";
import {Footer} from "../../components/Footer/Footer";
import { LoadingScreen } from "@/components/LoadingScreen/LoadingScreen";
import { isPasswordValid, userCred, getUserType, isLecturerForClass, User, classTable, saveClassTable, tutorListing, } from "../../helpers/validate";
import { useRouter } from 'next/router';
import { Alert, Button } from "@chakra-ui/react";
import { userApi } from "../../services/api";

import { useEffect, useState , useMemo } from "react";
import { TutorSubjectTable } from "@/components/SortingTable/SortingTable";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { TutorSubjectTableSort} from "@/components/SortingTable/SortingTableOrder";

interface errorProps{
    status: "success" | "info" | "warning" | "error" | "neutral" | undefined,
    message: string
}

export default function SubjectManager()
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

    // Variable hook that checks to see if the user is logged in properly
    const [passwordValid, setPasswordValid] = useState<boolean>(false);
    useEffect(() => {
        const validatePassword = async () => {
            const isValid = await isPasswordValid(user);
            setPasswordValid(isValid);
        };
        validatePassword();
    }, [user]);
   
    //Get login type from database
    const [loginType, setLoginType] = useState<string>("");
    useEffect(() => {
        const getTypeVal = async () => {
            const type = await getUserType(user.email);
            if(typeof type === "boolean")
            {
                setLoginType("");
            }
            else
            {
                setLoginType(type);
            }
        };
        getTypeVal();
    }, [user]);
    let content;

    //Checks to see if the lecturer is assigned to the class
    const [isLecturer, setIsLecturer] = useState<boolean>(false);
    useEffect(() => {
        const getLecturer = async () => {
            const type = await isLecturerForClass(user.email, subject||"");
            setIsLecturer(type);
        };
        getLecturer();
    }, [subject, user]);


    //Setup hooks for each table list
    const[candidateTutList, setCandidateTutList] = useLocalStorage<User[]>("tempCandidateList", []);
    const[selectedTutList, setSelectedTutList] = useLocalStorage<User[]>("tempSelectedList", []);
    const[candidateLabList, setCandidateLabList] = useLocalStorage<User[]>("tempCandidateList", []);
    const[selectedLabList, setSelectedLabList] = useLocalStorage<User[]>("tempSelectedList", []);

    //Set table values using API
    useEffect(() => {
        const getCandidates = async () => {
            if(subject)
            {
                const returnVal: classTable = await userApi.getCandidatesFor(subject||"");
                setCandidateTutList(returnVal.tutorApplicants);
                setSelectedTutList(returnVal.tutorAccepted);
                setCandidateLabList(returnVal.labApplicants);
                setSelectedLabList(returnVal.labAccepted);
            }
            else
            {
                setCandidateTutList([]);
                setSelectedTutList([]);
                setCandidateLabList([]);
                setSelectedLabList([]);
            }
        };
        getCandidates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subject]);


    const [popout, setPopout] = useState<errorProps>({status: "success", message: "Loading"});

    // Save List to LocalStorage. This will be replaced with A DB function later
    async function saveChanges()
    {
        // Setting accepted and candidate tutors using type/javascript spaghetti 
        const acceptedTutor: User[] = selectedTutList;
        const candidateTutor: User[] = candidateTutList;
        const acceptedLab: User[] = selectedLabList;
        const candidateLab: User[] = candidateLabList;

        let formatAcceptedTutor: tutorListing[] = [];
        let formatCandidateTutor: tutorListing[] = [];
        let formatAcceptedLab: tutorListing[] = [];
        let formatCandidateLab: tutorListing[] = [];

        formatAcceptedTutor = acceptedTutor.map((x, index)=>
            ({
            email: x.email,
            class_code: subject || "",
            role_name: "tutor",
            accepted: true,
            active_tutor: true,
            ranking: index+1
         }));

        formatCandidateTutor = candidateTutor.map((x)=>
            ({
            email: x.email,
            class_code: subject || "",
            role_name: "tutor",
            accepted: false,
            active_tutor: true,
            ranking: -1
         }));

        formatAcceptedLab = acceptedLab.map((x, index)=>
            ({
            email: x.email,
            class_code: subject || "",
            role_name: "lab_assistant",
            accepted: true,
            active_tutor: true,
            ranking: index+1
         }));

        formatCandidateLab = candidateLab.map((x)=>
            ({
            email: x.email,
            class_code: subject || "",
            role_name: "lab_assistant",
            accepted: false,
            active_tutor: true,
            ranking: -1
         }));

        const submitData: saveClassTable = {
            tutorApplicants: formatCandidateTutor,
            tutorAccepted: formatAcceptedTutor,
            labApplicants: formatCandidateLab,
            labAccepted: formatAcceptedLab
        };

        const returnVal = await userApi.setCandidatesFor(submitData);
        if (returnVal === true) {
            setPopout({status: "success", message: "Ranking successfully saved"});
            setTimeout(()=>{
                setPopout({status: "success", message: "Ranking successfully saved"});
            }, 3000)
        }
        else if(returnVal === false){
        }
    }

    //Same logic as in the user profile
    const [commentEmail, setCommentEmail] = useState<string | null>(null);
    const [temp, setTemp] = useState("");
    const comment = (email: string) => {
        setCommentEmail(email);
        setTemp("");
    }
    
    const send = (email: string, sender: string) => {
        const sendTo = `${email}_commentFrom_${sender}_class${subject}`; 
        localStorage.setItem(sendTo, temp);
        setCommentEmail(null);
    }

    //Generate content based on logged in status
    if(passwordValid && (loginType === "lecturer") && isLecturer)
        {
            content = <>
                <div className="pick-tutor-container">
                    <div className="subjectName">
                        {subject}
                    </div>
                    <div className="subMflex-sbs-subM">
                        {/* Generate left table */}
                        <h3>Select your candidates</h3>
                        <TutorSubjectTable table1={candidateTutList} table2={selectedTutList} setTable1={setCandidateTutList} setTable2={setSelectedTutList}/>
                        {/* Generate right table */}
                        <h3>Accepted candidates</h3>
                        <TutorSubjectTableSort table2={candidateTutList} table1={selectedTutList} setTable2={setCandidateTutList} setTable1={setSelectedTutList}/>
                    </div>
                    <div className="save-button">
                        <Button colorPalette={"green"} p="4" onClick={saveChanges}>Save Changes</Button>
                    </div>
                    <div className="comment-container">
                    <div className="ft">
                        <h3>Comment Candidates</h3>
                    </div>
                        {selectedTutList.length > 0 ? (
                            <div className="comment-box">
                                <ul>
                                    {selectedTutList.map((user) => (
                                        <li key={user.email}>{user.full_name ?? user.email}
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
                    <Alert.Root status={popout.status}>
                        <Alert.Indicator />
                        <Alert.Title>{popout.message}</Alert.Title>
                    </Alert.Root>
            </>
            ;
        }
        else
        {
            content = <LoadingScreen/>
        }

    return(
        <>
            <title>{subject}</title>
            <Header isLoggedIn={passwordValid} accountType={loginType}/>
            {content}
            <Footer isLoggedIn={passwordValid} type=""/>
        </>
    );
    
}