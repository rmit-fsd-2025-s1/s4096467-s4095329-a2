import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Users } from "./Users"

@Entity()
export class Certifications {

    @PrimaryGeneratedColumn("increment")
    certification_key: number

    @Column({type: "text"})
    certification: string

    @ManyToOne(() => Users, (user) => user.certifications)
    @JoinColumn({name: "user_key"})
    user_key: string
}
