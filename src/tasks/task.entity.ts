import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { ETaskStatus } from './enums/task-status.enum';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: ETaskStatus;
}
