import bcrypt from "bcryptjs";
import { UserController } from "../controller/UserController";
import { AppDataSource } from "../data-source";
import { Users } from "../entity/Users";
import { Classes } from "../entity/Classes";

interface updateReturn{
    success: boolean,
    return: any[]
}

function isUppercase(inputString: string){
    try{
        const regex = new RegExp("[0-9]");
        const formatString = inputString.substring(0,4);
        if(regex.test(formatString)){
            return false;
        }
        if(formatString === formatString.toUpperCase()){
            return true;
        }
        return false;
    }
    catch(e){
        console.log(e);
        return false;
    }
}

function isLetterUppercase(inputString: string, pos: number){
    try{
        const formatString = inputString.substring(pos,pos+1);
        if(formatString)
        if(formatString === formatString.toUpperCase()){
            return true;
        }
        return false;
    }
    catch(e){
        console.log(e);
        return false;
    }
}

function isNumbers(inputString: string){
    try{
        const regex = new RegExp("^[0-9]+$");
        const formatString = inputString.substring(4);
        if(formatString.length < 4){
            return false;
        }
        if(!regex.test(formatString)){
            return false;
        }
        return true;
    }
    catch(e){
        console.log(e);
        return false;
    }
}

function duplicateCheck(inputString: string){
    let tempCheck: boolean = true;

    return tempCheck;
}

const userController = new UserController();

export const resolvers = {
    Query:{
        users: async () => {
            return await AppDataSource.manager.find(Users);
        },

        user: async (_: any, { identifier }: {identifier: string}) => {
            const user: Users = await AppDataSource.createQueryBuilder()
            .select("users")
            .from(Users, "users")
            .where("users.email = :email", { email: identifier })
            .getOne();

            if(user){
                return (user);
            }
            else{
                return (null);
            }
        },

        courses: async () => {
            return await AppDataSource.manager.find(Classes);
        },

        validLogin: async (_: any, { identifier, passphrase }: {identifier: string, passphrase: string}) => {
            const user: Users[] = await AppDataSource.manager.find(Users,
                {where:{
                    email: identifier
                }}
            );

            if(user.length > 0){
                return(bcrypt.compareSync(passphrase, user[0].password))
            }
            else{
                return (false);
            }
        },

        validAdminLogin: async (_: any, { identifier, passphrase }: {identifier: string, passphrase: string}) => {
            const user: Users[] = await AppDataSource.manager.find(Users,
                {where:{
                    email: identifier,
                    role: "admin"
                }}
            );

            if(user.length > 0){
                return(bcrypt.compareSync(passphrase, user[0].password))
            }
            else{
                return (false);
            }
        }
    },

    Mutation:{
        addLecturer: async () => {
            return true;
        },

        addCourse: async (_: any, { codeIn, nameIn }: {codeIn: string, nameIn: string}) => {
            try{
                let isSuccessful = true;

                if(!duplicateCheck(codeIn)){
                    isSuccessful = false;
                }

                if(!isUppercase(codeIn)){
                    isSuccessful = false;
                }
                
                if(!isNumbers(codeIn)){
                    isSuccessful = false;
                }
                
                if(!isLetterUppercase(codeIn, 0)){
                    isSuccessful = false;
                }
                
                if(nameIn.length <= 0){
                    isSuccessful = false;
                }
                
                if(codeIn.length <= 0){
                    isSuccessful = false;
                }

                if(isSuccessful){
                    await AppDataSource.getRepository(Classes)
                    .save({
                        class_code: codeIn,
                        subject_name: nameIn
                    });
                }

                //Get updated classes to return
                const updatedClasses = await AppDataSource.manager.find(Classes);
                return ({success: isSuccessful, return: updatedClasses});
            }
            catch(e){
                console.log(e);
                return ({success: false, return: []});
            }

        }
    },
};