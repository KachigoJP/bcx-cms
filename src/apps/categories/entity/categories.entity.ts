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
import { CategoryTranslationEntity } from './category-translation.entity';

export enum CategoryType {
  GENERAL = 'general',
  BLOG = 'blog',
  PAGE = 'page',
}

@Entity({ name: 'categories' })
export class CategoryEntity extends BaseEntity {
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

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: CategoryType,
    default: CategoryType.GENERAL,
  })
  type: CategoryType; // e.g., 'blog', 'page', etc.

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relation
  @ManyToOne(() => CategoryEntity, (category) => category.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  parent: CategoryEntity;

  @OneToMany(() => CategoryEntity, (category) => category.parent)
  children: CategoryEntity[];

  // Relation
  @ManyToOne(() => ProviderEntity, { nullable: true })
  @JoinColumn()
  provider: ProviderEntity;

  @OneToMany(
    () => CategoryTranslationEntity,
    (translation) => translation.category,
    { cascade: true },
  )
  translations: CategoryTranslationEntity[];
}
