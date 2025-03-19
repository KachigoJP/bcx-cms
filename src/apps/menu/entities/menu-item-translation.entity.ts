import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MenuItem } from './menu-item.entity';

@Entity('menu_item_translations')
export class MenuItemTranslation {
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

  @ManyToOne(() => MenuItem, (menuItem) => menuItem.translations, {
    onDelete: 'CASCADE',
  })
  menuItem: MenuItem;
}
