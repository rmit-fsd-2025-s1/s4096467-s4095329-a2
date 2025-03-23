import Link from "next/link";
import "./Footer.css";

interface FooterProps
{
    isLoggedIn: Boolean,
    type: String;
}

export function Footer({isLoggedIn, type}: FooterProps)
{
    let logOut;
    if(isLoggedIn)
    {
        logOut = <Link href=""><p>Log Out</p></Link>
    }

    return(
        <div className="footer-container">
            <span>
                <h3>Quick Links</h3>
                <Link href="/"><p>Home</p></Link>
                <Link href=""><p>About Us</p></Link>
                <Link href=""><p>FAQ</p></Link>
                <Link href=""><p>Privacy Policy</p></Link>
                <Link href=""><p>Terms of Service</p></Link>
                <Link href="/login"><p>Log In</p></Link>
                <Link href="/register"><p>Register</p></Link>
                {logOut}
            </span>
            <span>
                <h3>Contact Us</h3>
                <Link href=""><p>Email</p></Link>
                <Link href=""><p>Phone</p></Link>
            </span>
            <span>
                <h3>Navigation</h3>
                <Link href="/"><p>Home</p></Link>
                <Link href="/educator/educator"><p>Educator Dashboard</p></Link>
            </span>
        </div>
    );
}