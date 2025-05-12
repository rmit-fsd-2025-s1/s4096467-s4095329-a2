import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Users } from "./Users"

@Entity()
export class Skills {

    @PrimaryGeneratedColumn("increment")
    skill_key: number

    @Column({type: "text"})
    skill: string

    @ManyToOne(() => Users, (user) => user.email)
    @JoinColumn({name: "user_key"})
    user_key: string
}
