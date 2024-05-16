import { Entity, PrimaryGeneratedColumn, ManyToOne, UpdateDateColumn, CreateDateColumn, Column } from "typeorm";
import { User } from "./User";

@Entity()
export class RefreshToken {

    @PrimaryGeneratedColumn()
    id: number;


    @Column({ type: "timestamp" })
    expiresAt: Date;


    @ManyToOne(() => User)
    user: User;


    @UpdateDateColumn()
    updatedAt: Number;


    @CreateDateColumn()
    createdAt: Number;
}
