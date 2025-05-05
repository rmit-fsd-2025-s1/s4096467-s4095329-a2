import { AppDataSource } from "../../data-source"
import { Users } from "../../entity/Users"

AppDataSource.initialize().then(async () => {

    console.log("Loading users from the database...")
    const users = await AppDataSource.manager.find(Users, { relations: ["certifications", "educations", "languages", "previous_roles", "skills"] })
    console.log("Loaded users: ", users)

    console.log("Here you can setup and run express / fastify / any other framework.")

}).catch(error => console.log(error))
