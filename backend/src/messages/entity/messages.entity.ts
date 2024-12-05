import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Chat } from 'src/chats/entity/chats.entity';
import { Users } from 'src/users/entity/users.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  // @Column({ type: 'enum', enum: ['me', 'other'] })
  // sender: 'me' | 'other';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column({ type: 'enum', enum: ['text', 'image', 'multiple-images'] })
  type: 'text' | 'image' | 'multiple-images';

  @ManyToOne(() => Chat, (chat) => chat.messages, { onDelete: 'CASCADE' })
  chat: Chat;

  @ManyToOne(() => Users)
  sender: Users; // Change from string enum to Users relation
}
