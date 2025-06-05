import bcrypt from "bcryptjs";
import { userApi } from "../services/api";
import { userState} from "./validate"
import { User } from "./validate";
import { detailsDB } from "@/pages/educator/userProfile";

//idk why this is here perhaps I migrate it somewhere else?
export async function registerUser(newUser: Partial<User>){
    console.log("Called register user")
    try
    {   
        const result = await userApi.createUser(newUser);
        console.log("reg", result)
        //Not proud of this code but hey it works
        if (result.message === "User registered") {
            return true;
        } 
        else {
            return false;
        }
    }
    catch(e)
    {   
        console.error("Error");
        return false;
    }
}

export async function getUser(email: string){
    console.log("Called get userInfo")
    try
    {   
        //There shouldnt be any errors here. Should be handled by controller
        const result = await userApi.getUserByEmail(email);
        return result;
    }
    catch(e)
    {   
        console.error("Error");
        return false;
    }
}

export async function postField(field: keyof detailsDB, text: string, email: string){
    console.log("Called get postField")
    try
    {   
        const result = await userApi.postField(field, text, email);
        return result;
    }
    catch(e)
    {   

    }
}

export async function deleteField(field: keyof detailsDB, key: number, email: string){
    console.log("Called get deleteField")
    try
    {   
        const result = await userApi.deleteField(field, key, email);
        return result;
    }
    catch(e)
    {   

    }
}



