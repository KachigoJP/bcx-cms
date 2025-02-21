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
import { TagEntity } from './tags.entity';

@Entity({ name: 'tag_relations' })
export class TagRelationEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  objectType: string;

  @Column()
  objectId: number;
  
  @ManyToOne(() => TagEntity, (tag) => tag.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tagId' })
  tag: TagEntity;

  @Column()
  tagId: number;

  @CreateDateColumn()
  created_at: Date;

  // Relation
  @ManyToOne(() => ProviderEntity)
  @JoinColumn()
  provider: ProviderEntity;
}
