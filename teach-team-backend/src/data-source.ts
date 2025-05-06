import "reflect-metadata"
import { DataSource } from "typeorm"
import { Users } from "./entity/Users"
import { Certifications } from "./entity/Certifications"
import { Previous_Roles } from "./entity/Previous_Roles"
import { Educations } from "./entity/Educations"
import { Languages } from "./entity/Languages"
import { Skills } from "./entity/Skills"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "209.38.26.237",
    port: 3306,
    username: "S4095329",
    password: "S4095329",
    database: "S4095329",
    synchronize: false,
    logging: false,
    entities: [Users, Certifications, Educations, Languages, Previous_Roles, Skills],
    migrations: [],
    subscribers: [],
})
