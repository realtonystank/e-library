import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  title!: string;
  @Column()
  coverImage!: string;
  @Column()
  genre!: string;
  @ManyToMany(() => User)
  @JoinTable()
  author!: User[];
  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;
  @UpdateDateColumn({ type: "datetime" })
  updatedAt!: Date;
}
