import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from "typeorm"
import { Users } from "./Users"
import { Tutors } from "./Tutors"

@Entity()
export class Classes {

    @PrimaryGeneratedColumn("uuid")
    class_code: string

    @Column({type: "varchar", length: 1000})
    subject_name: string

    @ManyToMany(() => Users, (user) => user.email, {eager:true})
    @JoinTable({
        name: "lecturer_classes",
        joinColumn: {
            name: "class_code", // column in join table referencing Classes
            referencedColumnName: "class_code"
        },
        inverseJoinColumn: {
            name: "email", // column in join table referencing Users
            referencedColumnName: "email"
        }  
    })
    lecturers: Users[]

    @OneToMany(() => Tutors, (tutor) => tutor.classes, {eager:true})
    tutors: Tutors[]
}