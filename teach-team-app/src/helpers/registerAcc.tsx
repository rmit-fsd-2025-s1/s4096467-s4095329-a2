import bcrypt from "bcryptjs";
import { userApi } from "../services/api";
import { userState} from "./validate"
import { User } from "./validate";

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
