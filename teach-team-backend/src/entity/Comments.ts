import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Tutors } from "./Tutors"

@Entity()
export class Comments {

    @PrimaryGeneratedColumn("increment")
    comment_id: number

    @ManyToOne(() => Tutors, (tutor) => tutor.comments)
    @JoinColumn([
        { name: "email", referencedColumnName: "email" },
        { name: "class_code", referencedColumnName: "class_code" }
    ])
    tutor: Tutors

    @Column()
    comment: string
}
