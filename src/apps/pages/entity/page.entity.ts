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
  JoinTable,
  OneToMany,
} from 'typeorm';

// Source
import { PUBLISH_STATUS } from '@utils/enum/publish_status.enum';
import ProviderEntity from '@apps/providers/entity/provider.entity';
import { PageCategoryEntity } from '@apps/categories/entity';
import { LanguageEntity } from '@apps/languages/entity';
import { UserEntity } from '@apps/user/entities/user.entity';

@Entity({ name: 'pages' })
export class PageEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
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
    type: 'text',
    nullable: true,
  })
  photo: string;

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

  // Metadata
  // @OneToMany(() => PageMetadataEntity, (metadata) => metadata.page)
  // @JoinTable()
  // metadata: PageMetadataEntity[];

  // Translation
  @ManyToOne(() => PageEntity)
  @JoinTable()
  root: PageEntity;

  @OneToMany(() => PageEntity, (translation) => translation.root)
  @JoinTable()
  translation: PageEntity;

  @ManyToOne(() => LanguageEntity)
  @JoinTable()
  language: LanguageEntity;

  // Relation
  @ManyToOne(() => UserEntity)
  @JoinTable()
  author: UserEntity;

  @ManyToOne(() => PageCategoryEntity)
  @JoinTable()
  category: PageCategoryEntity;

  @ManyToOne(() => ProviderEntity)
  @JoinColumn()
  provider: ProviderEntity;
}
