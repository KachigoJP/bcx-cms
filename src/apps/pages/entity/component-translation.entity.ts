import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ComponentEntity } from './component.entity';

@Entity({ name: 'component_translations' })
export class ComponentTranslationEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 10 })
  language: string;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'jsonb', nullable: true })
  config: Record<string, any>;

  @ManyToOne(() => ComponentEntity, (component) => component.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'component_id' })
  component: ComponentEntity;
}
