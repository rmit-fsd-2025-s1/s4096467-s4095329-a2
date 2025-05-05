//A function that generates a box that tells you to log in
import { InvalidLogin } from "@/components/InvalidLogin/InvalidLogin";
import { Spinner } from "@chakra-ui/react"
import styles from "./LoadingScreen.module.css"
import { useEffect, useState} from "react";

export function LoadingScreen()
{
    const [message, setMessage] = useState(false);

    useEffect(() => {
        setTimeout(() => setMessage(true), 5000); 
        console.log("5 seconds have passed")
    }, []);

    return(
        <div className={styles["load"]}>
            {message ? (
                <InvalidLogin />
            ) : (
                <>
                    <h1>Loading...</h1>
                    <Spinner color="rgb(59, 189, 91)" size="xl" borderWidth="4px" />
                </>
            )}
        </div>
    );
}