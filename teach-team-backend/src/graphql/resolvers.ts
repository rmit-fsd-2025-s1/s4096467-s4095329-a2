import bcrypt from "bcryptjs";
import { UserController } from "../controller/UserController";
import { AppDataSource } from "../data-source";
import { Users } from "../entity/Users";

const userController = new UserController();

export const resolvers = {
    Query:{
        users: async () => {
            return await AppDataSource.manager.find(Users);
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
            console.log(identifier + ":" + passphrase);
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
        }
    },
};