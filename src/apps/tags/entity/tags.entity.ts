import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import ProviderEntity from '@apps/providers/entity/provider.entity';

@Entity({ name: 'tags' })
export class TagEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  slug: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relation
  @ManyToOne(() => ProviderEntity)
  @JoinColumn()
  provider: ProviderEntity;
}
