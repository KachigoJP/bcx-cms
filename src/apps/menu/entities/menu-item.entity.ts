import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MenuEntity } from './menu.entity';
import { MenuItemTranslationEntity } from './menu-item-translation.entity';

@Entity('menu_items')
export class MenuItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order: number;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  // Self-referencing relationship for parent-child hierarchy
  @ManyToOne(() => MenuItemEntity, (menuItem) => menuItem.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parent: MenuItemEntity;

  @OneToMany(() => MenuItemEntity, (menuItem) => menuItem.parent)
  children: MenuItemEntity[];

  @ManyToOne(() => MenuEntity, (menu) => menu.menuItems, {
    onDelete: 'CASCADE',
  })
  menu: MenuEntity;

  @OneToMany(
    () => MenuItemTranslationEntity,
    (translation) => translation.menuItem,
  )
  translations: MenuItemTranslationEntity[];
}
