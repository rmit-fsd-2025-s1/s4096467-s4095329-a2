import "reflect-metadata"
import { DataSource } from "typeorm"
import { Users } from "./entity/Users"
import { Certifications } from "./entity/Certifications"
import { Previous_Roles } from "./entity/Previous_Roles"
import { Educations } from "./entity/Educations"
import { Languages } from "./entity/Languages"
import { Skills } from "./entity/Skills"
import { Classes } from "./entity/Classes"
import { Tutors } from "./entity/Tutors"
import { Comments } from "./entity/Comments"

export const AppDataSource = new DataSource({
    type: "", // Replace with the actual database type, e.g., "mysql", "postgres", etc.
    host: "", // Replace with the actual host, e.g., "localhost" or an IP address
    port: , // Replace with the actual port number, e.g., 3306 for MySQL
    username: "", // Replace with actual login credentials
    password: "",
    database: "", // Replace with the actual database name
    synchronize: true, // Turn off for production, leave on for first time running to create tables
    logging: false,
    entities: [Users, Certifications, Educations, Languages, Previous_Roles, Skills, Classes, Tutors, Comments],
    migrations: [],
    subscribers: [],
})
