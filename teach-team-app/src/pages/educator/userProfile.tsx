import {Header} from "../../components/Header/Header";
import {Footer} from "../../components/Footer/Footer";
import {HomeContent} from "../../components/Home/Home";
import { isPasswordValid, userCred, getPasswordForUser, getUserType, getSummary, 
    getPrevRoles, getAvail, getCertifications, getSkills, getLanguages, getName, getEducation} from "../../helpers/validate";

import "./userProfile.css";
import "../../styles/user-home.css";
import { useEffect, useState } from "react";
import { Button, Card} from "@chakra-ui/react"

//some function to get username form their email before character '@';

export default function loginScreen()
{
    const[localEmail, setLocalEmail] = useState<string>("");
    const[localPassword, setLocalPassword] = useState<string>("");
    
    useEffect(() => 
    {
        setLocalEmail(localStorage.getItem("localEmail")||"");
    }, []);
    
    useEffect(() => 
    {
        setLocalPassword(localStorage.getItem("localPassword")||"");
    }, []);

    let user: userCred = {email: localEmail, password:localPassword};
    let passwordValid = isPasswordValid(user);
    let loginType = getUserType(user.email);
    let userName = localEmail.substring(0, localEmail.indexOf("@"));
    let name = getName(user.email);
    let summary = getSummary(user.email);
    let roles = getPrevRoles(user.email);
    let availability = getAvail(user.email);
    let cert = getCertifications(user.email);
    let skills = getSkills(user.email);
    let languages = getLanguages(user.email);
    let education = getEducation(user.email);

    return(
        <>
            <Header isLoggedIn={passwordValid} accountType={loginType}/>
            <div className="profile">
                <div className="userHeader">
                    <h1>Hello {name}</h1>
                    <p>Here you can update your details and see your messages</p>
                </div>
                {/* TODO Add functionality like input box then save using the button */}
                <div className="details">
                    <div className="box1">
                        <div className="about">            
                            <h2>Summary</h2>
                            <p>{summary}</p>
                            <Button color="green" colorPalette="green" variant="outline" size="xl" p="4">Edit Summary</Button>
                            <br/>
                        </div>
                        <div className="prevRoles">
                            <h2>Career History</h2>
                            <p>{roles}</p>
                            <Button color="green" colorPalette="green" variant="outline" size="xl" p="4">Edit Roles</Button>
                            <br/>
                        </div>
                        <div className="education">
                            <h2>Education</h2>
                            <p>{education}</p>
                            <Button color="green" colorPalette="green" variant="outline" size="xl" p="4">Edit Educations</Button>
                            <br/>
                        </div>
                        <div className="skills">
                            <h2>Skills</h2>
                            <p>{skills}</p>
                            <Button color="green" colorPalette="green" variant="outline" size="xl" p="4">Edit skills</Button>
                        </div>
                    </div>
                    <div className="box2">
                        <div className="cert">
                            <h2>Certifications</h2>
                            <p>{cert}</p>
                            <Button color="green" colorPalette="green" variant="outline" size="xl" p="4">Edit Certifications</Button>
                            <hr className="divider"/>
                        </div>
                        <div className="avail">
                            <h2>Availability</h2>
                            <p>{availability}</p>
                            <Button color="green" colorPalette="green" variant="outline" size="xl" p="4">Edit Availability</Button>
                            <hr className="divider"/>
                        </div>
                        <div className="languages">
                            <h2>Languages</h2>
                            <p>{languages}</p>
                            <Button color="green" colorPalette="green" variant="outline" size="xl" p="4">Edit Languages</Button>
                        </div>
                    </div>
                </div>
                <div className="comments">
                    <h2>Lecturer Comments:</h2><br/>
                    {/* if not comments... show you have no comments */}
                    <Card.Root font-size="30" p="4">
                        <Card.Header>This is just a sample. May or may not use a card here</Card.Header>
                        <Card.Body>Get lecturer comments and put them here.</Card.Body>
                        <Card.Footer />
                    </Card.Root>
                    <br/>
                    <Card.Root font-size="30" p="4">
                        <Card.Header>This is just a sample. May or may not use a card here</Card.Header>
                        <Card.Body>Get lecturer comments and put them here.</Card.Body>
                        <Card.Footer />
                    </Card.Root>
                </div>
            </div>
            <Footer isLoggedIn={passwordValid} type=""/>
        </>
    );
    
}
