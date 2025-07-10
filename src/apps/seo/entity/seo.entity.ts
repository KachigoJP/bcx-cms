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

@Entity({ name: 'seo' })
export class SeoEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  meta_title: string;

  @Column({ type: 'text' })
  meta_description: string;

  @Column({ type: 'text', nullable: true })
  meta_keywords: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  canonical_url: string;

  @Column({
    type: 'enum',
    enum: [
      'index, follow',
      'noindex, follow',
      'index, nofollow',
      'noindex, nofollow',
    ],
    default: 'index, follow',
  })
  robots:
    | 'index, follow'
    | 'noindex, follow'
    | 'index, nofollow'
    | 'noindex, nofollow';

  @Column({ type: 'varchar', length: 255, nullable: true })
  og_title: string;

  @Column({ type: 'text', nullable: true })
  og_description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  og_image: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  twitter_title: string;

  @Column({ type: 'text', nullable: true })
  twitter_description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  twitter_image: string;

  @Column({ type: 'varchar', length: 50 })
  objectType: string; // e.g., 'page', 'blog', 'product'

  @Column({ type: 'int' })
  objectId: number; // ID of the associated object

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relation
  @ManyToOne(() => ProviderEntity)
  @JoinColumn()
  provider: ProviderEntity;
}
