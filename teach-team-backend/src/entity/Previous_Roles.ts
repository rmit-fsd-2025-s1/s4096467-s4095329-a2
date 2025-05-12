import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Users } from "./Users"

@Entity()
export class Previous_Roles {

    @PrimaryGeneratedColumn("increment")
    role_key: number

    @Column({type: "text"})
    prev_role: string

    @ManyToOne(() => Users, (user) => user.email)
    @JoinColumn({name: "user_key"})
    user_key: string
}
