import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Menu } from './menu.entity';
import { MenuItemTranslation } from './menu-item-translation.entity';

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Self-referencing relationship for parent-child hierarchy
  @ManyToOne(() => MenuItem, (menuItem) => menuItem.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parent: MenuItem;

  @OneToMany(() => MenuItem, (menuItem) => menuItem.parent)
  children: MenuItem[];

  @ManyToOne(() => Menu, (menu) => menu.menuItems, { onDelete: 'CASCADE' })
  menu: Menu;

  @OneToMany(() => MenuItemTranslation, (translation) => translation.menuItem)
  translations: MenuItemTranslation[];
}
