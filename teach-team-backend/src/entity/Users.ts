import { Entity, Column, OneToMany, ManyToMany } from "typeorm"
import { Certifications } from "./Certifications"
import { Educations } from "./Educations"
import { Languages } from "./Languages"
import { Previous_Roles } from "./Previous_Roles"
import { Skills } from "./Skills"
import { Classes } from "./Classes"
import { Tutors } from "./Tutors"

@Entity()
export class Users {

    @Column({ primary: true, type: "uuid" })
    email: string

    @Column({type: "varchar", length: 1000})
    full_name: string

    @Column({type: "char", length: 60})
    password: string

    @Column({type: "varchar", length: 9})
    role: string

    @Column({type: "varchar", length: 9})
    availability: string
    
    @Column({type: "text"})
    summary: string

    @Column({type: "boolean", default: true})
    active: boolean

    @OneToMany(() => Certifications, (certification) => certification.user_key, {cascade: true, eager:true,})
    certifications: Certifications[]

    @OneToMany(() => Educations, (education) => education.user_key, {cascade: true, eager:true,})
    educations: Educations[]

    @OneToMany(() => Languages, (language) => language.user_key, {cascade: true, eager:true,})
    languages: Languages[]

    @OneToMany(() => Previous_Roles, (role) => role.user_key, {cascade: true, eager:true,})
    previous_roles: Previous_Roles[]

    @OneToMany(() => Skills, (skill) => skill.user_key, {cascade: true, eager:true,})
    skills: Skills[]

    @ManyToMany(() => Classes, (classes) => classes.lecturers)
    lectures: Classes[]

    @OneToMany(() => Tutors, (tutor) => tutor.user)
    tutorJoin: Tutors[]
}

export { Certifications }
