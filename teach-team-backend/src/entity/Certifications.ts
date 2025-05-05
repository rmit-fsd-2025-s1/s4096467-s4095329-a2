import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Users } from "./Users"

@Entity()
export class Certifications {

    @PrimaryGeneratedColumn()
    certification_key: string

    @Column()
    certification: string

    @ManyToOne(() => Users, (user) => user.email)
    @JoinColumn({name: "user_key"})
    user_key: string
}
