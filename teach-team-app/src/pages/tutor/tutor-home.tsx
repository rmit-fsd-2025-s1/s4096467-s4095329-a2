import {Header} from "../../components/Header/Header";
import {Footer} from "../../components/Footer/Footer";

import "../../styles/user-home.css";

export default function loginScreen()
{
    return(
        <>
            <title>Tutor Home</title>
            <Header isLoggedIn={true} />
                Tutor
            <Footer isLoggedIn={true} type=""/>
        </>
    );
}