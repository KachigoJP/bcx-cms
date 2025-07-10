import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { PageEntity } from './page.entity';
import { ComponentEntity } from './component.entity';

@Entity({ name: 'page_components' })
@Index('IDX_PAGE_ID', ['page'])
@Index('IDX_COMPONENT_ID', ['component'])
@Index('IDX_ORDER', ['order'])
export class PageComponentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: false, default: 0 })
  order: number;

  @ManyToOne(() => PageEntity, (page) => page.pageComponents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'page_id' })
  page: PageEntity;

  @ManyToOne(() => ComponentEntity, (component) => component.pageComponents, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'component_id' })
  component: ComponentEntity;
}
