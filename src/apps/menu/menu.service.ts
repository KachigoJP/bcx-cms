import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { MenuItem } from './entities/menu-item.entity';
import { MenuItemTranslation } from './entities/menu-item-translation.entity';
import {
  CreateMenuDto,
  UpdateMenuDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
} from './dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectRepository(MenuItemTranslation)
    private readonly menuItemTranslationRepository: Repository<MenuItemTranslation>,
  ) {}

  // Create a new menu
  async create(menuData: CreateMenuDto): Promise<Menu> {
    const menu = this.menuRepository.create(menuData);
    return this.menuRepository.save(menu);
  }

  // Get all menus
  async findAll(): Promise<Menu[]> {
    return this.menuRepository.find();
  }

  // Get a single menu by ID
  async findOne(menuId: number): Promise<Menu> {
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
  async update(menuId: number, menuData: UpdateMenuDto): Promise<Menu> {
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
  ): Promise<MenuItem> {
    const { id, parentId, order, isActive, translations } = createMenuItemDto;

    // Find the menu the item belongs to
    const menu = await this.findOne(id);

    // Find the parent menu item (if provided)
    let parent: MenuItem = null;
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
      isActive: isActive ?? true, // Default to true if not provided
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
  async findAllMenuItems(menuId: number): Promise<MenuItem[]> {
    return this.menuItemRepository.find({
      where: { menu: { id: menuId } },
      relations: ['parent', 'children', 'translations'],
      order: { order: 'ASC' },
    });
  }

  // Get a single menu item by ID
  async findMenuItemById(itemId: number): Promise<MenuItem> {
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
  ): Promise<MenuItem> {
    const { id, parentId, order, isActive, translations } = updateData;
    const menuItem = await this.findMenuItemById(itemId);
    Object.assign(menuItem, { id, parentId, order, isActive });

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
