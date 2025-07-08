import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PageEntity } from './page.entity';

@Entity({ name: 'page_translations' })
export class PageTranslationEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 10 })
  language: string;

  @Column({ type: 'varchar', nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @ManyToOne(() => PageEntity, (page) => page.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'page_id' })
  page: PageEntity;
}
