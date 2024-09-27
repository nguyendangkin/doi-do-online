import { Post } from '@nestjs/common';
import { Role } from 'src/auth/enums/role.enum';
import { Posts } from 'src/posts/entity/post.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: Role.User })
  role: Role;

  @Column({ nullable: true })
  avatarUrl: string;

  @OneToMany(() => Posts, (post) => post.user)
  post: Posts[];
}
