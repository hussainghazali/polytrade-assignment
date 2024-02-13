import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { File } from 'src/files/entites/file.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, 
  DeleteDateColumn, ManyToMany, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export class Magazine {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;
  
  @Column({ nullable: true })
  price: string;

  @JoinColumn({ name: "fileId" })
  @OneToOne(() => File, {
    nullable: true,
  })
  file?: File;
  @Column({ nullable: true })
  fileId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToMany(() => Subscription, subscription => subscription.magazine)
  subscriptions: Subscription[];
}
