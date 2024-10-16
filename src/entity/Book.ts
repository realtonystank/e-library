import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity({ name: "Book" })
export class Book {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  title!: string;
  @Column()
  coverImage!: string;
  @Column()
  file!: string;
  @Column()
  genre!: string;
  @Column()
  author!: string;
  @ManyToOne(() => User)
  @JoinColumn()
  createdBy!: User;
  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;
  @UpdateDateColumn({ type: "datetime" })
  updatedAt!: Date;
}
