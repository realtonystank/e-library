import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ nullable: true })
  name!: string;
  @Column({ unique: true })
  email!: string;
  @Column()
  password!: string;
  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;
  @UpdateDateColumn({ type: "datetime" })
  updatedAt!: Date;
}
