//A function that generates a box that tells you to log in
import { Spinner } from "@chakra-ui/react"
import "./LoadingScreen.css"
export function LoadingScreen()
{
    return(
        <div className="load">
            <h1>Loading...</h1>
            <Spinner color="rgb(59, 189, 91)" size="xl" borderWidth="4px"/>
        </div>
    );
}