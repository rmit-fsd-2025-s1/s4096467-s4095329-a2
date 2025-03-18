import {Header} from "../../components/Header/Header";
import {Footer} from "../../components/Footer/Footer";

import "../../styles/user-home.css";

export default function loginScreen()
{
    return(
        <>
            <title>Lecturer Home</title>
            <Header isLoggedIn={true} />
                Lecturer
            <Footer isLoggedIn={true} type=""/>
        </>
    );
    
}
