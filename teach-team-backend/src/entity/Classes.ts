import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from "typeorm"
import { Users } from "./Users"

@Entity()
export class Classes {

    @PrimaryGeneratedColumn()
    class_code: string

    @Column()
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
}