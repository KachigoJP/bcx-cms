import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import ProviderEntity from '@apps/providers/entity/provider.entity';
import { CategoryEntity } from './categories.entity';

@Entity({ name: 'category_relations' })
export class CategoryRelationsEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  objectType: string;

  @Column()
  objectId: number;

  @CreateDateColumn()
  created_at: Date;

  // Relation
  @ManyToOne(() => CategoryEntity, (category) => category.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  @Column()
  categoryId: number;
  
  // Relation
  @ManyToOne(() => ProviderEntity)
  @JoinColumn()
  provider: ProviderEntity;
}
