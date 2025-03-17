import "./Header.css";

interface HeaderProps
{
    isLoggedIn: Boolean;
}

export function Header(props: HeaderProps)
{
    let profile;
    if(props.isLoggedIn)
    {
        profile = <img src="https://saturn.csit.rmit.edu.au/~s4096467/RMITCats/virus.png" alt="User Profile Picture" className="profile-picture"/>;
    }
    else
    {
        profile = <><button>Log In</button><button>Register</button></>;
    }

    return(
        <div className="header-container">
            <a href="">
            <span className="header-section">
                <img src="https://gumtreeau-res.cloudinary.com/image/private/t_$_75/gumtree/8adfb076-8f0f-4a22-befe-d225b5ccfca3.jpg" alt="Annoying Cat"/>
                    <h1>TeachTeam Management</h1>
            </span>
                </a>
                <span>
                    {profile}
                </span>
        </div>
    )
}