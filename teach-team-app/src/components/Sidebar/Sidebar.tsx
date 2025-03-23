import "./Sidebar.css";
import {useState, FormEvent, useEffect} from "react";
import {useRouter} from "next/navigation";
import Link from 'next/link'

interface SidebarProps
{
    isLoggedIn: Boolean;
}

export function Sidebar()
{
    // If user is logged in render header, footer, sidebar etc. if not then take user to login page.
    //Basically always render this when user is logged in.
    return (
        <>
            <aside className="sidebar">
                <div className="sidebar-header">
                    <img src="placeholder1.svg"></img>
                    <h2>TeachTeam</h2>
                </div>
                <ul className="links">
                    <h4>
                        <span>General</span>
                        <div className="menuline"></div>
                    </h4>
                    <li>
                        <Link href=""><span className="material-symbols-outlined">home</span>Home</Link>
                    </li>
                    <li>
                        <Link href=""><span className="material-symbols-outlined">Help</span>PlaceHolder</Link>
                    </li>
                    <li>
                        <Link href=""><span className="material-symbols-outlined">Help</span>PlaceHolder</Link>
                    </li>                    
                    <li>
                        <Link href=""><span className="material-symbols-outlined">Help</span>PlaceHolder</Link>
                    </li>                    
                    <li>
                        <Link href=""><span className="material-symbols-outlined">Help</span>PlaceHolder</Link>
                    </li>
                    <div className="sidebar-bottom">
                        <h4>
                            <span>Account</span>
                            <div className="menuline"></div>
                        </h4>
                        <li>
                            <Link href=""><img src="placeholder1.svg"></img>Profile</Link>
                        </li>
                        <li>
                            <Link href=""><span className="material-symbols-outlined">settings</span>Settings</Link>
                        </li>
                        <li>
                            <Link href=""><span className="material-symbols-outlined">logout</span>Log out</Link>
                        </li>
                    </div>
                </ul>
            </aside>
        </>
    )
}