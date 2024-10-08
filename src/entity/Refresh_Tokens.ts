import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity({ name: "refreshTokens" })
export class Refresh_Tokens {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ nullable: true })
  token!: string;
  @Column({ type: "datetime" })
  expiresAt!: Date;
  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user!: User;
  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;
}
