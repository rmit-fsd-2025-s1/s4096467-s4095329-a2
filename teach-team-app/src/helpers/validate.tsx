import bcrypt from "bcryptjs";

export interface userState
{
    email: string,
    password: string,
    role: string,
    classes?: string[]
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
        return(bcrypt.compareSync(password, db.get(email)?.password||""));
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
    {   //Return type
        return(db.get(email)?.role??"");
    }
    else
    {
        return "none";
    }
}

export function isLecturerForClass(email: string, classCode: string)
{
    let db: Map<string, userState> = generateUsers();

    if(db.has(email))
        {
            if(db.get(email)?.classes?.includes(classCode))
            {
                return true;
            }
        }
        return false;
}

//Function to generate users, will use DB later
export function generateUsers()
{
    const user1: userState = 
    {
        email: "test1@gmail.com",
        //Password1
        password: "$2b$10$skYNjqeufCqB25xbsyU0..B3Po4NytpQb3es47Khdxsynl/biPzXO",
        role: "tutor"
    }

    const user2: userState = 
    {
        email: "connor@gmail.com",
        //P@ssword1
        password: "$2b$10$8C6C.0Ph4SljkgQchNCxuu/BaMwziIA3Uz66S/5rciwtUJflURPlK",
        role: "lecturer",
        classes: ["COSC1121", "COSC1122", "COSC1123"]
    }

    const user3: userState = 
    {
        email: "will@gmail.com",
        //P@ssword2
        password: "$2b$10$IVaJqtZuG1oo6xj2lHi/4.20ZWCbYWPgtqA7r0.aBKrxvF699.skq",
        role: "lecturer",
        classes: ["COSC1124", "COSC1125", "COSC1126"]
    }

    let returnMap = new Map<string, userState>();

    returnMap.set("test1@gmail.com", user1);
    returnMap.set("connor@gmail.com", user2);
    returnMap.set("will@gmail.com", user3);

    return returnMap;
}