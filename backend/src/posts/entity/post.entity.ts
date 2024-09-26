import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { array: true }) // lưu nhiều đường dẫn ảnh
  images: string[];

  @Column('text')
  content: string;
}
