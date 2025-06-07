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
        }
    },
};