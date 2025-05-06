import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {useRouter} from "next/navigation";

interface HeaderProps
{
    isLoggedIn: boolean;
    accountType: string; //Acc Type, tutor, lecturer
}

export function Header({isLoggedIn, accountType}: HeaderProps)
{   
    const router:AppRouterInstance = useRouter();

    //Get the email from storage and display as username
    const[localEmail, setLocalEmail] = useState<string>("");
    useEffect(() => 
        {
            setLocalEmail(localStorage.getItem("localEmail")||"");
        }, []);
    const userName = localEmail.substring(0, localEmail.indexOf("@"));

    const logOutRedirect = () => 
        {
            localStorage.setItem("localEmail", "");
            localStorage.setItem("localPassword", "");
            router.push('/login');
        }

    //TODO UNIT TESTING
    return(
        <div className="header-container">
            <Link href={isLoggedIn?"/educator/educator":"/"}>
                <span className="header-section">
                    <Image src="/graduation-cap.svg" alt="graduation cap" width={50} height={50}/>
                        <h1>Teach<span className="green">Team</span> Management</h1>
                </span>
            </Link>
            {/* Remove accounttype === tutor if needed later in other assignments */}
            {isLoggedIn && accountType === "tutor"?<div className="user">
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
                    {isLoggedIn && (<Link className ="home" href="/educator/educator"><span className="material-symbols-outlined">home</span>Home</Link>)}
                    {/* Conditional rendering*/}
                    {accountType === "tutor" ? (
                        <Link href="/educator/apply"><span className="material-symbols-outlined">file_copy</span>Apply</Link>
                    ) : null}
                    {accountType === "lecturer" ? (
                        <Link href="/educator/educator"><span className="material-symbols-outlined">menu_book</span>Courses</Link>
                    ) : null}
                    {isLoggedIn && (<Link href=""><span className="material-symbols-outlined">Help</span>Help</Link>)}                

                    <div className="bottom">
                        {/* Remove accounttype === tutor if needed later in other assignments */}
                        {isLoggedIn && accountType === "tutor"?<Link href="/educator/userProfile"><span className="material-symbols-outlined">account_circle</span>Profile</Link>:<></>}
                        
                        {isLoggedIn && (<Link href=""><span className="material-symbols-outlined">settings</span>Settings</Link>)}
                        {isLoggedIn?
                        (<Link href="" onClick={(e)=>{e.preventDefault(); logOutRedirect();}}><span className="material-symbols-outlined">logout</span>Log out</Link>):
                        (<><Link href="/register"><span className="material-symbols-outlined">person_add</span>Register</Link>
                        <Link href="/login"><span className="material-symbols-outlined">login</span>Log in</Link></>)}
                        
                    </div>
                </div>
            </nav>
        </div>
    )
}