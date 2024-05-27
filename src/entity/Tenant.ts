import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from "typeorm";

@Entity({ name: "tenants" })
export class Tenant {
    @PrimaryGeneratedColumn()
    id: number;


    @Column('varchar', { length: 30 })
    name: String;


    @Column('varchar', { length: 255 })
    address: String;


    @UpdateDateColumn()
    updatedAt: Number;


    @CreateDateColumn()
    createdAt: Number;

}
