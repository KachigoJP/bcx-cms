import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  ManyToMany,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';

// Source
import { PUBLISH_STATUS } from '@utils/enum/publish_status.enum';
import ProviderEntity from '@apps/providers/entity/provider.entity';
import { PageCategoryEntity } from '@apps/page_categories/entity';

@Entity({ name: 'pages' })
export class PageEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  title: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  slug: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  content: string;

  @Column({
    type: 'enum',
    enum: PUBLISH_STATUS,
    default: PUBLISH_STATUS.DRAFT,
  })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  // Relation
  @ManyToOne(() => ProviderEntity)
  @JoinColumn()
  provider: ProviderEntity;

  @ManyToOne(() => PageCategoryEntity)
  @JoinColumn()
  category: PageCategoryEntity;
}
