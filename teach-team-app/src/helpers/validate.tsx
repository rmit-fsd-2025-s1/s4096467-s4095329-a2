export interface userState
{
    email: string,
    password: string,
    role: string;
}

export interface userCred
{
    email: string,
    password: string
}

export function isPasswordValid(user: userCred)
{
    return(getPasswordForUser(user));
}

export function getPasswordForUser({email, password}: userCred)
{
    // Populates the Map, this will be done with a DB later
    let db: Map<string, userState> = generateUsers();

    //If the name is found in the Map
    if(db.has(email))
    {
        const hashPass: string = db.get(email)?.password ?? "";
        return(password=== hashPass?true:false);
    }
    else
    {
        return(false);
    }
}

//Returns whether the user is a lecturer, tutor or none
export function getUserType(email: string)
{
    // Populates the Map, this will be done with a DB later
    let db: Map<string, userState> = generateUsers();

    //If the name is found in the map
    if(db.has(email))
    {
        return(db.get(email)?.role);
    }
    else
    {
        return "none";
    }
}

//Function to generate users, will use DB later
export function generateUsers()
{
    const user1: userState = 
    {
        email: "test1@gmail.com",
        password: "Password1",
        role: "tutor"
    }

    const user2: userState = 
    {
        email: "connor@gmail.com",
        password: "P@ssword1",
        role: "lecturer"
    }

    const user3: userState = 
    {
        email: "will@gmail.com",
        password: "P@ssword2",
        role: "lecturer"
    }

    let returnMap = new Map<string, userState>();

    returnMap.set("test1@gmail.com", user1);
    returnMap.set("connor@gmail.com", user2);
    returnMap.set("will@gmail.com", user3);

    return returnMap;
}