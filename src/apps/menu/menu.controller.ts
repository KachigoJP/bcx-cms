import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Source
import { MenuService } from './menu.service';
import { MenuEntity } from './entities/menu.entity';
import {
  CreateMenuDto,
  UpdateMenuDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
} from './dto';
import { MenuItemEntity } from './entities/menu-item.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // Create a new menu
  @Post()
  async create(@Body() menuData: CreateMenuDto): Promise<MenuEntity> {
    return this.menuService.create(menuData);
  }

  // Get all menus
  @Get()
  async findAll() {
    return this.menuService.findAll();
  }

  // Get a single menu by ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<MenuEntity> {
    return this.menuService.findOne(id);
  }

  // Update a menu by ID
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() menuData: UpdateMenuDto,
  ): Promise<MenuEntity> {
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
  ): Promise<MenuItemEntity> {
    return this.menuService.createMenuItem(createMenuItemDto);
  }

  // Get all menu items for a specific menu
  @Get(':id/items')
  async findAllMenuItems(
    @Param('id') menuId: number,
  ): Promise<MenuItemEntity[]> {
    return this.menuService.findAllMenuItems(menuId);
  }

  // Get a single menu item by ID
  @Get('items/:itemId')
  async findMenuItemById(
    @Param('itemId') itemId: number,
  ): Promise<MenuItemEntity> {
    return this.menuService.findMenuItemById(itemId);
  }

  // Update a menu item by ID
  @Patch('items/:itemId')
  async updateMenuItem(
    @Param('itemId') itemId: number,
    @Body() updateData: UpdateMenuItemDto,
  ): Promise<MenuItemEntity> {
    return this.menuService.updateMenuItem(itemId, updateData);
  }

  // Delete a menu item by ID
  @Delete('items/:itemId')
  async removeMenuItem(@Param('itemId') itemId: number): Promise<void> {
    return this.menuService.removeMenuItem(itemId);
  }
}
