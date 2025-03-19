import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { Menu } from './entities/menu.entity';
import {
  CreateMenuDto,
  UpdateMenuDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
} from './dto';
import { MenuItem } from './entities/menu-item.entity';

@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // Create a new menu
  @Post()
  async create(@Body() menuData: CreateMenuDto): Promise<Menu> {
    return this.menuService.create(menuData);
  }

  // Get all menus
  @Get()
  async findAll(): Promise<Menu[]> {
    return this.menuService.findAll();
  }

  // Get a single menu by ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Menu> {
    return this.menuService.findOne(id);
  }

  // Update a menu by ID
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() menuData: UpdateMenuDto,
  ): Promise<Menu> {
    return this.menuService.update(id, menuData);
  }

  // Delete a menu by ID
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.menuService.remove(id);
  }

  // Create a new menu item
  @Post(':id/items')
  async createMenuItem(
    @Body() createMenuItemDto: CreateMenuItemDto,
  ): Promise<MenuItem> {
    return this.menuService.createMenuItem(createMenuItemDto);
  }

  // Get all menu items for a specific menu
  @Get(':id/items')
  async findAllMenuItems(@Param('id') menuId: number): Promise<MenuItem[]> {
    return this.menuService.findAllMenuItems(menuId);
  }

  // Get a single menu item by ID
  @Get('items/:itemId')
  async findMenuItemById(@Param('itemId') itemId: number): Promise<MenuItem> {
    return this.menuService.findMenuItemById(itemId);
  }

  // Update a menu item by ID
  @Patch('items/:itemId')
  async updateMenuItem(
    @Param('itemId') itemId: number,
    @Body() updateData: UpdateMenuItemDto,
  ): Promise<MenuItem> {
    return this.menuService.updateMenuItem(itemId, updateData);
  }

  // Delete a menu item by ID
  @Delete('items/:itemId')
  async removeMenuItem(@Param('itemId') itemId: number): Promise<void> {
    return this.menuService.removeMenuItem(itemId);
  }
}
