import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { PageEntity } from './page.entity';
import { ComponentEntity } from 'src/apps/component/entity/component.entity';
import { PageComponentTranslationEntity } from './page-component-translation.entity';

@Entity({ name: 'page_components' })
export class PageComponentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PageEntity, (page) => page.pageComponents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'page_id' })
  page: PageEntity;

  @Column({ type: 'int', nullable: false, default: 0 })
  order: number;

  @Column({ type: 'jsonb', nullable: true })
  config: Record<string, any>;

  @ManyToOne(() => ComponentEntity, (component) => component.pageComponents, {
    eager: true,
    onDelete: 'CASCADE',
  })
  component: ComponentEntity;

  @OneToMany(
    () => PageComponentTranslationEntity,
    (translation) => translation.pageComponent,
    { cascade: true },
  )
  translations: PageComponentTranslationEntity[];
}
