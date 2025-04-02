import "./Header.css";
import Link from 'next/link';
import { getUserType, isPasswordValid, userCred } from "@/helpers/validate";
import { redirect } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {useRouter} from "next/navigation";

interface HeaderProps
{
    isLoggedIn: Boolean;
    accountType: string; //Acc Type, tutor, lecturer
}

export function Header({isLoggedIn, accountType}: HeaderProps)
{   
    let profile;
    const router:AppRouterInstance = useRouter();

    //Get the email from storage and display as username
    const[localEmail, setLocalEmail] = useState<string>("");
    useEffect(() => 
        {
            setLocalEmail(localStorage.getItem("localEmail")||"");
        }, []);
    let userName = localEmail.substring(0, localEmail.indexOf("@"));

    const logOutRedirect = () => 
        {
            localStorage.setItem("localEmail", "");
            localStorage.setItem("localPassword", "");
            router.push('/login');
        }

    if(isLoggedIn)
    {   
        //TODO User pfp obtained from the database
        profile = <img src="https://saturn.csit.rmit.edu.au/~s4096467/RMITCats/virus.png" alt="User Profile Picture" className="profile-picture"/>;
    }

    //TODO UNIT TESTING
    return(
        <div className="header-container">
            <Link href={isLoggedIn?"/educator/educator":"/"}>
                <span className="header-section">
                    <img src="/graduation-cap.svg"/>
                        <h1>Teach<span className="green">Team</span> Management</h1>
                </span>
            </Link>
            {isLoggedIn?<div className="user">
                <Link href="/educator/userProfile">
                    <span className="user-profile">
                        <h3>{userName}</h3>
                    </span>                    
                </Link>
            </div>:<></>}
            
            <nav>
                <input type="checkbox" id="sidebar-active"/>
                <label htmlFor="sidebar-active" className="open">
                    <svg xmlns="http://www.w3.org/2000/svg" height="32x" viewBox="0 -960 960 960" width="32px" fill="black">
                        <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
                    </svg>
                </label>
                
                <label id="overlay" htmlFor="sidebar-active"></label>
                <div className="links-container">
                    <label htmlFor="sidebar-active" className="close">
                        <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="white">
                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                        </svg>
                    </label>
                    <Link className ="home" href="/educator/userProfile"><span className="material-symbols-outlined">home</span>Home</Link>
                    {/* Conditional rendering*/}
                    {accountType === "tutor" ? (
                        <Link href="/educator/apply"><span className="material-symbols-outlined">file_copy</span>Apply</Link>
                    ) : null}
                    {accountType === "lecturer" ? (
                        <Link href="/educator/educator"><span className="material-symbols-outlined">menu_book</span>Courses</Link>
                    ) : null}                
                    <a href=""><span className="material-symbols-outlined">Help</span>Help</a>

                    <div className="bottom">
                        {isLoggedIn?<Link href="/educator/userProfile"><span className="material-symbols-outlined">account_circle</span>Profile</Link>:<></>}
                        
                        <Link href=""><span className="material-symbols-outlined">settings</span>Settings</Link>
                        {isLoggedIn?
                        (<Link href="" onClick={(e)=>{e.preventDefault(); logOutRedirect();}}><span className="material-symbols-outlined">logout</span>Log out</Link>):
                        (<Link href="/login"><span className="material-symbols-outlined">login</span>Log in</Link>)}
                        
                    </div>
                </div>
            </nav>
        </div>
    )
}