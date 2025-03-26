import Link from "next/link";
import "./Footer.css";
import { useEffect, useState } from "react";
import {useRouter} from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface FooterProps
{
    isLoggedIn: Boolean,
    type: String;
}

export function Footer({isLoggedIn, type}: FooterProps)
{
    const router:AppRouterInstance = useRouter();

    //When ran, it will log the user out
    const logOutRedirect = () => 
        {
            //Clear localStorage, logging out the user
            localStorage.setItem("localEmail", "");
            localStorage.setItem("localPassword", "");
        
            //Redirect to login page
            router.push('/login');
        }

    let logOut;
    if(isLoggedIn)
    {
        logOut = <Link href="" onClick={(e)=>{e.preventDefault(); logOutRedirect();}}><p>Log Out</p></Link>
    }

    return(
        <>
        <div className="footer-container">
        <h1><span className="material-symbols-outlined">school</span><u>Teach<span className="green1">Team</span>.</u></h1>
            <span>
                <h3>Community</h3>
                <Link href=""><p>About us</p></Link>
                <Link href=""><p>FAQ</p></Link>
                <Link href="/register"><p>Register</p></Link>
            </span>
            <span>
                <h3>Support</h3>
                <Link href=""><p>Email</p></Link>
                <Link href=""><p>Phone</p></Link>
                <Link href=""><p>Help</p></Link>
            </span>
            <span>
                <h3>Site</h3>
                <Link href="/educator/educator"><p>Educator Dashboard</p></Link>
                <Link href=""><p>Privacy Policy</p></Link>
                <Link href=""><p>Terms of Service</p></Link>
                {logOut}
            </span>
        </div>
        </>
    );
}