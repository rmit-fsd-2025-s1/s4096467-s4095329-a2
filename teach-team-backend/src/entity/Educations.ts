import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Users } from "./Users"

@Entity()
export class Educations {

    @PrimaryGeneratedColumn()
    education_key: string

    @Column()
    education: string

    @ManyToOne(() => Users, (user) => user.email)
    @JoinColumn({name: "user_key"})
    user_key: string
}
