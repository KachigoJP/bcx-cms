import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PageComponentEntity } from './page-component.entity';

@Entity({ name: 'page_component_translations' })
export class PageComponentTranslationEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 10 })
  language: string;

  @Column({ type: 'jsonb', nullable: true })
  config: Record<string, any>;

  @ManyToOne(
    () => PageComponentEntity,
    (pageComponent) => pageComponent.translations,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'page_component_id' })
  pageComponent: PageComponentEntity;
}
