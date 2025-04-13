import React, { useEffect, useState , useMemo} from "react";
import { Button, Card} from "@chakra-ui/react"
import { isPasswordValid, userCred, getPasswordForUser, getUserType, getUserData, userState, generateUsers, getLectureClasses} from "../../helpers/validate";
import "./Comments.css"

interface commentsFromL {
    lecturers: string;
    comment: string;
    classCode: string;
}

//We use this to access validate
export interface subject
{
    code: string,
    subjectName: string,
    candidates: string[]
    accepted: string[]
}

//Creates a comment from the Lecturer
function CreateComment({lecturers, comment, classCode}: commentsFromL)
{  
    return(
        <div className="comment-card">
            <Card.Root _hover={{bg: "gray.100", boxShadow: "md"}} transition="background 0.05s ease-in-out" boxShadow={"sm"} p="4">
                <Card.Header>{comment}</Card.Header>
                <Card.Body color="grey">From: {lecturers}</Card.Body>
                <Card.Body color="grey">Class: {classCode}</Card.Body>
            </Card.Root>
        </div>

    );
}

export default function Comments() {
    //Set up state hooks
    const[localEmail, setLocalEmail] = useState<string>("");

    useEffect(() => {
        setLocalEmail(localStorage.getItem("localEmail")||"");
    }, []);

    //generate list of users
    let db: Map<string, userState> = generateUsers();
    //use state for the objs
    const [lecturerComments, setLecturerComments] = useState<commentsFromL[]>([]);
    const [commentFound, setCommentFound] = useState(false);
    const [code, setCode] = useState("");

    useEffect(() => {
        const lecturers = [];

        // Iterate over the Map to access each userState object
        //Get all the lecturers in the database
        for (const [email, user] of db) {
            const role = user.role;
            if (role === "lecturer") {
                lecturers.push(user.email)
            }
        }

        //Get the comments from each lecturer and class and store them in getComment
        const getComment: commentsFromL[] = [];
        lecturers.forEach((lecturer) => {

            const classes = getLectureClasses(lecturer);
            classes.forEach((subj) => {

                const comment = localStorage.getItem(`${localEmail}_commentFrom_${lecturer}_class${subj.code}`);
                console.log("subject", subj.code)
                if (comment) {
                    getComment.push({ lecturers: lecturer, comment: comment, classCode: subj.code});
                    setCommentFound(true);
                }
            });
        });
        //Update array
        setLecturerComments(getComment);

    }, [localEmail]);

    return (
        <>
        {commentFound ? (
            <div className="comment-cont">
            {lecturerComments.map((comment) => (
                <CreateComment lecturers={comment.lecturers} comment={comment.comment} classCode={comment.classCode}/>
            ))}
            </div>
        ) : (
            <p>No comments are availble</p>
        )}
        </>
    )
}