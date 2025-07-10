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
  Index,
} from 'typeorm';

// Source
import { PUBLISH_STATUS } from '@utils/enum/publish_status.enum';
import ProviderEntity from '@apps/providers/entity/provider.entity';
import { CategoryEntity } from '@apps/categories/entity';
import { LanguageEntity } from '@apps/languages/entity';
import { UserEntity } from '@apps/user/entities/user.entity';
import { TagEntity } from '@apps/tags/entity';
import { PageTranslationEntity } from './page-translation.entity';
import { SeoEntity } from '@apps/seo/entity/seo.entity';
import { PageComponentEntity } from './page-component.entity';

@Entity({ name: 'pages' })
export class PageEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
  })
  title: string;

  @Index()
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

  @ManyToOne(() => ProviderEntity)
  @JoinColumn()
  provider: ProviderEntity;

  @ManyToOne(() => CategoryEntity, { nullable: true })
  @JoinColumn()
  category: CategoryEntity;

  @OneToMany(() => PageTranslationEntity, (translation) => translation.page, {
    cascade: true,
  })
  translations: PageTranslationEntity[];

  @OneToOne(() => SeoEntity, { cascade: true, nullable: true })
  @JoinColumn()
  seo: SeoEntity;

  @OneToMany(() => PageComponentEntity, (pc) => pc.page, {
    cascade: true,
    eager: true,
  })
  pageComponents: PageComponentEntity[];
}
