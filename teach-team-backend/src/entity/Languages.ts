import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Users } from "./Users"

@Entity()
export class Languages {

    @PrimaryGeneratedColumn()
    language_key: string

    @Column()
    language: string

    @ManyToOne(() => Users, (user) => user.email)
    @JoinColumn({name: "user_key"})
    user_key: string
}
