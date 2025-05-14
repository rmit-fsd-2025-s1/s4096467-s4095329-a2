import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn, OneToMany } from "typeorm"
import { Users } from "./Users"
import { Classes } from "./Classes"
import { Comments } from "./Comments";

@Entity()
export class Tutors {
    @PrimaryColumn("uuid")
    email: string;
    
    @PrimaryColumn("uuid")
    class_code: string;

    @PrimaryColumn({type: "varchar", length: 255})
    role_name: string

    @Column({type: "bit", default: false})
    accepted: boolean

    @Column({type: "bit", default: true})
    active_tutor: boolean

    @OneToMany(() => Comments, (comment) => comment.tutor, {eager: true})
    comments: Comments[]

    @ManyToOne(() => Users, (user) => user.email, {eager: true})
    @JoinColumn({ name: "email" })
    user: Users
    
    @ManyToOne(() => Classes, (cls) => cls.class_code)
    @JoinColumn({ name: "class_code" })
    classes: Classes
}