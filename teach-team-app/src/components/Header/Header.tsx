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
                        <h1>TeachTeam Management</h1>
                </span>
            </Link>
            <span>
                {profile}
            </span>
        </div>
    )
}