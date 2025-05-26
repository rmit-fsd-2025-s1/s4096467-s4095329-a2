import bcrypt from "bcryptjs";
import { User, userApi } from "../services/api";
import {userState} from "./validate"

//idk why this is here perhaps I migrate it somewhere else?
export async function registerUser(newUser: Partial<User>){
    console.log("Called register user")
    try
    {
        const result = await userApi.createUser(newUser);
        console.log("Did something")
        return result;
    }
    catch(e)
    {   
        console.error("Error");
        return false;
    }
}
