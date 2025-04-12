import React, { useEffect, useState , useMemo} from "react";
import { Button, Card} from "@chakra-ui/react"
import { isPasswordValid, userCred, getPasswordForUser, getUserType, getUserData, userState, generateUsers} from "../../helpers/validate";

interface commentsFromL {
    lecturers: string;
    comment: string;
}

//Creates a comment from the Lecturer
function CreateComment({lecturers, comment}: commentsFromL)
{  
    return(
        <Card.Root _hover={{bg: "gray.100", boxShadow: "md"}} transition="background 0.05s ease-in-out" boxShadow={"sm"} p="4">
            <Card.Header>{comment}</Card.Header>
            <Card.Body color="grey">From: {lecturers}</Card.Body>
        </Card.Root>
    );
}

export default function Comments() {
    //Set up state hooks
    const[localEmail, setLocalEmail] = useState<string>("");
    const[localPassword, setLocalPassword] = useState<string>("");

    useEffect(() => {
        setLocalEmail(localStorage.getItem("localEmail")||"");
        setLocalPassword(localStorage.getItem("localPassword")||"");
    }, []);

    const user: userCred = useMemo(() => ({
        email: localEmail,
        password: localPassword
    }), [localEmail, localPassword]);

    //generate list of users
    let db: Map<string, userState> = generateUsers();
    //use state for the objs
    const [lecturerComments, setLecturerComments] = useState<commentsFromL[]>([]);
    const [commentFound, setCommentFound] = useState(false);

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

        //Get the comments from each lecturer and store them in getComment
        const getComment: commentsFromL[] = [];
        lecturers.forEach((lecturer) => {
            const comment = localStorage.getItem(`${localEmail}_commentFrom_${lecturer}`);
            //when the comment is found add it to the array
            if (comment) {
                getComment.push({ lecturers: lecturer, comment: comment });
                setCommentFound(true);
            }
        });
        //Update array
        setLecturerComments(getComment);

    }, [localEmail]);

    return (
        <>
        {commentFound ? (
            <>
            {lecturerComments.map((comment) => (
                <CreateComment lecturers={comment.lecturers} comment={comment.comment} />
            ))}
            </>
        ) : (
            <p>No comments are availble</p>
        )}
        </>
    )
}