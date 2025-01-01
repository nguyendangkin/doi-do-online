import { Users } from 'src/users/entity/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { array: true })
  images: string[];

  @Column('text')
  content: string;

  @Column({ nullable: true })
  tag: string;

  @ManyToOne(() => Users, (user) => user.post, { onDelete: 'CASCADE' })
  user: Users;

  @CreateDateColumn()
  createdAt: Date;
}
