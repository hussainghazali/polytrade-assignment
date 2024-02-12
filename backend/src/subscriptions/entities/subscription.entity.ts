import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Magazine } from 'src/magazines/entities/magazine.entity';

@Entity('subsriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User,  user => user.subscriptions)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  magazineId: string;

  @ManyToOne(() => Magazine,  magazine => magazine.subscriptions)
  @JoinColumn({ name: "magazineId" })
  magazine: Magazine;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ default: true })
  cancelled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
