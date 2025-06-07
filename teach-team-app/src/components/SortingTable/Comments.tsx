import { useEffect, useMemo, useState } from "react";
import { Card} from "@chakra-ui/react"
import { userState, generateUsers, getLectureClasses} from "../../helpers/validate";
import { getComments } from "@/helpers/frontendHelper";

// interface commentsFromL {
//     lecturers: string;
//     comment: string;
//     classCode: string;
// }

interface comment {
    comment_id: number,
    comment: string,
}

//We use this to access validate
export interface subject
{
    code: string,
    subjectName: string,
    candidates: string[]
    accepted: string[]
}

// //Creates a comment from the Lecturer
// function CreateComment({lecturers, comment, classCode}: commentsFromL)
// {  
//     return(
//         <div className="comment-card">
//             <Card.Root _hover={{bg: "gray.100", boxShadow: "md"}} transition="background 0.05s ease-in-out" boxShadow={"sm"} p="4">
//                 <Card.Header>{comment}</Card.Header>
//                 <Card.Body color="grey">From: {lecturers}</Card.Body>
//                 <Card.Body color="grey">Class: {classCode}</Card.Body>
//             </Card.Root>
//         </div>

//     );
// }

//Creates a comment from the Lecturer
function GenComment({ comment }: { comment: string }) 
{
    return (
        <div className="comment-card">
            <Card.Root _hover={{ bg: "gray.100", boxShadow: "md" }} transition="background 0.05s ease-in-out" boxShadow={"sm"} p="4">
                <Card.Body color="grey">{comment}</Card.Body>
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
    //TODO I changed this just in case anything breaks come back here
    // const db = useMemo<Map<string, userState>>(() => generateUsers(), []);
    //use state for the objs
    // const [lecturerComments, setLecturerComments] = useState<commentsFromL[]>([]);
    const [commentFound, setCommentFound] = useState(false);

    // useEffect(() => {
    //     const lecturers = [];

    //     // Iterate over the Map to access each userState object
    //     //Get all the lecturers in the database
    //     for (const [, user] of db) {
    //         const role = user.role;
    //         if (role === "lecturer") {
    //             lecturers.push(user.email)
    //         }
    //     }

    //     //Get the comments from each lecturer and class and store them in getComment
    //     const getComment: commentsFromL[] = [];
    //     lecturers.forEach((lecturer) => {

    //         const classes = getLectureClasses(lecturer);
    //         classes.forEach((subj) => {

    //             const comment = localStorage.getItem(`${localEmail}_commentFrom_${lecturer}_class${subj.code}`);
    //             console.log("subject", subj.code)
    //             if (comment) {
    //                 getComment.push({ lecturers: lecturer, comment: comment, classCode: subj.code});
    //                 setCommentFound(true);
    //             }
    //         });
    //     });
    //     //Update array
    //     setLecturerComments(getComment);

    // }, [localEmail]);

    //DB IMPLEMENTATION HERE
    const[allComments, setComments] = useState<comment[]>([]);
    
    useEffect(() => {
        const runOnShow = () => {
            const getAllComments = async () => {
                const result = await getComments(localEmail);
                setComments(result)
            }
            getAllComments();
        }
        runOnShow();
    }, [localEmail])
    
    useEffect(() => {
        setCommentFound(allComments.length > 0);
    }, [allComments]);

    return (
        <>
        {commentFound ? (
            <div className="comment-cont">
            {/* {lecturerComments.map((comment) => (
                <CreateComment key={comment.comment} lecturers={comment.lecturers} comment={comment.comment} classCode={comment.classCode}/>
            ))} */}
            {allComments.map((commentObj) => (
                <GenComment key={commentObj.comment_id} comment={commentObj.comment} />
            ))}

            </div>
        ) : (
            <p>No comments are availble</p>
        )}
        </>
    )
}