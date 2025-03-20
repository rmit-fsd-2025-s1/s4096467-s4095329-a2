export interface userState
{
    email: String,
    password: String;
}

export function isPasswordValid(user: userState)
{
    return(getPasswordForUser(user));
}

export function getPasswordForUser({email, password}: userState)
{
    return(password=="Password1"?true:false);
}