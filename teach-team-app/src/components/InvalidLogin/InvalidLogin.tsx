//A function that generates a box that tells you to log in
export function InvalidLogin()
{
    return(
        <div>
            <h3>You do not have permission to view this page</h3>
            <p>If you have one, please log in to your account that has access.</p>
        </div>
    );
}