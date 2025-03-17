import "./Footer.css";

interface FooterProps
{
    isLoggedIn: Boolean;
}

export function Footer(props: FooterProps)
{
    let logOut;
    if(props.isLoggedIn)
    {
        logOut = <a><p>Log Out</p></a>
    }

    return(
        <div className="footer-container">
            <span>
                <h3>Quick Links</h3>
                <a href=""><p>Home</p></a>
                <a href=""><p>About Us</p></a>
                <a href=""><p>FAQ</p></a>
                <a href=""><p>Privacy Policy</p></a>
                <a href=""><p>Terms of Service</p></a>
                <a href=""><p>Log In</p></a>
                <a href=""><p>Register</p></a>
                {logOut}
            </span>
            <span>
                <h3>Contact Us</h3>
                <a href=""><p>Email</p></a>
                <a href=""><p>Phone</p></a>
            </span>
            <span>
                <h3>Navigation</h3>
                <a href=""><p>Home</p></a>
            </span>
        </div>
    );
}