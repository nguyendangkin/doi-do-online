import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Message } from 'src/messages/entity/messages.entity';
import { Users } from 'src/users/entity/users.entity';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users)
  sender: Users;

  @ManyToOne(() => Users)
  receiver: Users;

  @Column({ type: 'varchar', nullable: true })
  lastMessage: string;

  @Column({ type: 'timestamp', nullable: true })
  timestamp: Date;

  @Column({ type: 'int', default: 0 })
  unread: number;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];
}
