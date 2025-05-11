import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from "typeorm"
import { Certifications } from "./Certifications"
import { Educations } from "./Educations"
import { Languages } from "./Languages"
import { Previous_Roles } from "./Previous_Roles"
import { Skills } from "./Skills"
import { Classes } from "./Classes"

@Entity()
export class Users {

    @Column({ primary: true })
    email: string

    @Column()
    full_name: string

    @Column()
    password: string

    @Column()
    role: string

    @Column()
    availability: string
    
    @Column()
    summary: string

    @OneToMany(() => Certifications, (certification) => certification.user_key, {eager:true,})
    certifications: Certifications[]

    @OneToMany(() => Educations, (education) => education.user_key, {eager:true,})
    educations: Educations[]

    @OneToMany(() => Languages, (language) => language.user_key, {eager:true,})
    languages: Languages[]

    @OneToMany(() => Previous_Roles, (role) => role.user_key, {eager:true,})
    previous_roles: Previous_Roles[]

    @OneToMany(() => Skills, (skill) => skill.user_key, {eager:true,})
    skills: Skills[]

    @ManyToMany(() => Classes, (classes) => classes.lecturers)
    lectures: Classes[]
}

export { Certifications }
