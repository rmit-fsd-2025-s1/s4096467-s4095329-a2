//A function that generates a box that tells you to log in
import styles from "./InvalidLogin.module.css"
import {Button} from "@chakra-ui/react";
import {useRouter} from "next/navigation";

export function InvalidLogin()
{
    const router = useRouter();
    const logIn = () => {
        router.push('/');
    }; 

    return(
        <>
        <div className={styles["page"]}>           
            <h4>If you are not logged in, you do not have permission to view this page.</h4>
            <h4>Please log in to your account to gain access.</h4>
            <h4>If you are logged in try refreshing the page.</h4>
            <Button variant='subtle' size='2xl' width="3" style={{padding: '0px 40px'}} onClick={logIn}>Log in</Button>
        </div>
        </>
    );
}