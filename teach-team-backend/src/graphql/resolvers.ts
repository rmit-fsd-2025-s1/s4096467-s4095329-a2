import { UserController } from "../controller/UserController";
import { AppDataSource } from "../data-source";
import { Users } from "../entity/Users";

const userController = new UserController();

export const resolvers = {
    Query:{
        users: async () => {
            return await AppDataSource.manager.find(Users);
        }
    },
    Mutation:{
        addLecturer: async () => {
            return true;
        }
    },
};