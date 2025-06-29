import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MenuItemEntity } from './menu-item.entity';

@Entity('menu_item_translations')
export class MenuItemTranslationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10 })
  language: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255 })
  url: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => MenuItemEntity, (menuItem) => menuItem.translations, {
    onDelete: 'CASCADE',
  })
  menuItem: MenuItemEntity;
}
