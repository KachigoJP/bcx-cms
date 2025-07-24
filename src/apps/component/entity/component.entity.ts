import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { PageComponentEntity } from '../../pages/entity/page-component.entity';

@Entity({ name: 'components' })
export class ComponentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  type: string;

  @Column({ type: 'jsonb', nullable: true })
  defaultConfig: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => PageComponentEntity, (pc) => pc.component)
  pageComponents: PageComponentEntity[];
}
