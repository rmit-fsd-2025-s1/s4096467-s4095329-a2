import "./Header.css";
import Link from 'next/link';

interface HeaderProps
{
    isLoggedIn: Boolean;
}

export function Header({isLoggedIn}: HeaderProps)
{
    let profile;
    if(isLoggedIn)
    {
        profile = <img src="https://saturn.csit.rmit.edu.au/~s4096467/RMITCats/virus.png" alt="User Profile Picture" className="profile-picture"/>;
    }
    else
    {
        // //is this necessary if we are gonna have this displayed only when the user is logged in?
        // profile = <>
        // <Link href="/login">
        //     <button className="loginButton">Log In</button>
        // </Link>
        // <Link href="/register">
        // <button className="registerButton">Register</button>
        // </Link>
        // </>;
    }

    return(
        <div className="header-container">
            <Link href={isLoggedIn?"/educator/educator":"/"}>
                <span className="header-section">
                    <img src="https://gumtreeau-res.cloudinary.com/image/private/t_$_75/gumtree/8adfb076-8f0f-4a22-befe-d225b5ccfca3.jpg" alt="Annoying Cat"/>
                        <h1>Teach<span className="green">Team</span> Management</h1>
                </span>
            </Link>
            {/* <span>
                {profile}
            </span> */}
            <div className="user">
                <Link href="">
                    <span className="user-profile">
                        <img src="userpfp.png"/>
                            <h3>UserName</h3>
                    </span>                    
                </Link>
            </div>
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
                    
                    <Link className ="home" href=""><span className="material-symbols-outlined">home</span>Home</Link>
                    {/* Conditinol rendering. Add Tutor side stuff here*/}
                    <Link href=""><span className="material-symbols-outlined">File_copy</span>Apply</Link>
                    {/* Conditial rendering. Add lecture side stuff here*/}
                    <Link href=""><span className="material-symbols-outlined">File_copy</span>Apply</Link>
                    <Link href=""><span className="material-symbols-outlined">File_copy</span>Apply</Link>
                    {/*Both*/}
                    <Link href=""><span className="material-symbols-outlined">Help</span>Help</Link>
                    <div className="bottom">
                        <Link href=""><span className="material-symbols-outlined">account_circle</span>Profile</Link>
                        <Link href=""><span className="material-symbols-outlined">settings</span>Settings</Link>
                        <Link href=""><span className="material-symbols-outlined">logout</span>Log out</Link>
                    </div>
                </div>
            </nav>
        </div>
    )
}