import { Users } from 'src/users/entity/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { array: true }) // lưu nhiều đường dẫn ảnh
  images: string[];

  @Column('text')
  content: string;

  @ManyToOne(() => Users, (user) => user.post, { onDelete: 'CASCADE' })
  user: Users;
}
