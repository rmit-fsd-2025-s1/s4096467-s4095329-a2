import {Header} from "../../components/Header/Header";
import {Footer} from "../../components/Footer/Footer";
import {HomeContent} from "../../components/Home/Home";

import "../../styles/user-home.css";

export default function loginScreen()
{
    return(
        <>
            <title>Lecturer Home</title>
            <Header isLoggedIn={true} />
            <HomeContent isLoggedIn={true} accountType="lecturer"/>
            <Footer isLoggedIn={true} type=""/>
        </>
    );
    
}
