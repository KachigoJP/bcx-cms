import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Source
import { LIMIT_PAGE } from '@config/constants';
import { MenuEntity } from './entities/menu.entity';
import { MenuItemEntity } from './entities/menu-item.entity';
import { MenuItemTranslationEntity } from './entities/menu-item-translation.entity';
import {
  CreateMenuDto,
  UpdateMenuDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
} from './dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private readonly menuRepository: Repository<MenuEntity>,
    @InjectRepository(MenuItemEntity)
    private readonly menuItemRepository: Repository<MenuItemEntity>,
    @InjectRepository(MenuItemTranslationEntity)
    private readonly menuItemTranslationRepository: Repository<MenuItemTranslationEntity>,
  ) {}

  // Create a new menu
  async create(menuData: CreateMenuDto): Promise<MenuEntity> {
    const menu = this.menuRepository.create(menuData);
    return this.menuRepository.save(menu);
  }

  // Get all menus
  async findAll() {
    return this.menuRepository.find();
  }

  // Get a single menu by ID
  async findOne(menuId: number): Promise<MenuEntity> {
    const menu = await this.menuRepository.findOne({
      where: { id: menuId },
      relations: ['items'],
    });
    if (!menu) {
      throw new NotFoundException(`Menu with ID \${menuId} not found`);
    }
    return menu;
  }

  // Update a menu by ID
  async update(menuId: number, menuData: UpdateMenuDto): Promise<MenuEntity> {
    const menu = await this.findOne(menuId);
    Object.assign(menu, menuData);
    return this.menuRepository.save(menu);
  }

  // Delete a menu by ID
  async remove(menuId: number): Promise<void> {
    const menu = await this.findOne(menuId);
    await this.menuRepository.remove(menu);
  }

  // Create a new menu item
  async createMenuItem(
    createMenuItemDto: CreateMenuItemDto,
  ): Promise<MenuItemEntity> {
    const { id, parentId, order, isActive, translations } = createMenuItemDto;

    // Find the menu the item belongs to
    const menu = await this.findOne(id);

    // Find the parent menu item (if provided)
    let parent: MenuItemEntity = null;
    if (parentId) {
      parent = await this.menuItemRepository.findOne({
        where: { id: parentId },
      });
      if (!parent) {
        throw new NotFoundException(
          `Parent menu item with ID \${parentId} not found`,
        );
      }
    }

    // Create the menu item
    const menuItem = this.menuItemRepository.create({
      menu,
      parent,
      order,
      is_active: isActive ?? true, // Default to true if not provided
    });

    const savedMenuItem = await this.menuItemRepository.save(menuItem);

    // Create translations for the menu item
    const menuItemTranslations = translations.map((translation) =>
      this.menuItemTranslationRepository.create({
        menuItem: savedMenuItem,
        language: translation.language,
        title: translation.title,
        url: translation.url,
      }),
    );

    await this.menuItemTranslationRepository.save(menuItemTranslations);

    return savedMenuItem;
  }

  // Get all menu items for a specific menu
  async findAllMenuItems(menuId: number): Promise<MenuItemEntity[]> {
    return this.menuItemRepository.find({
      where: { menu: { id: menuId } },
      relations: ['parent', 'children', 'translations'],
      order: { order: 'ASC' },
    });
  }

  // Get a single menu item by ID
  async findMenuItemById(itemId: number): Promise<MenuItemEntity> {
    const menuItem = await this.menuItemRepository.findOne({
      where: { id: itemId },
      relations: ['parent', 'children', 'translations'],
    });
    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID \${itemId} not found`);
    }
    return menuItem;
  }

  // Update a menu item by ID
  async updateMenuItem(
    itemId: number,
    updateData: UpdateMenuItemDto,
  ): Promise<MenuItemEntity> {
    const { id, parentId, order, isActive, translations } = updateData;
    const menuItem = await this.findMenuItemById(itemId);
    Object.assign(menuItem, { id, parentId, order, is_active: isActive });

    const updatedMenuItem = await this.menuItemRepository.save(menuItem);

    // Update translations
    if (translations) {
      // Remove existing translations
      await this.menuItemTranslationRepository.delete({ menuItem: { id } });

      // Add new translations
      const newTranslations = translations.map((translation) =>
        this.menuItemTranslationRepository.create({
          menuItem: updatedMenuItem,
          language: translation.language,
          title: translation.title,
          url: translation.url,
        }),
      );

      await this.menuItemTranslationRepository.save(newTranslations);
    }

    return updatedMenuItem;
  }

  // Delete a menu item by ID
  async removeMenuItem(itemId: number): Promise<void> {
    const menuItem = await this.findMenuItemById(itemId);
    await this.menuItemRepository.remove(menuItem);
  }
}
