import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { MenuService } from '../menu.service';
import { Menu } from '../entities/menu.entity';
import { MenuItem } from '../entities/menu-item.entity';
import { MenuItemTranslation } from '../entities/menu-item-translation.entity';
import { CreateMenuItemDto, UpdateMenuItemDto } from '../dto';

describe('MenuService - MenuItem Methods', () => {
  let service: MenuService;
  let menuRepository;
  let menuItemRepository;
  let menuItemTranslationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        {
          provide: getRepositoryToken(Menu),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(MenuItem),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(MenuItemTranslation),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MenuService>(MenuService);
    menuRepository = module.get(getRepositoryToken(Menu));
    menuItemRepository = module.get(getRepositoryToken(MenuItem));
    menuItemTranslationRepository = module.get(
      getRepositoryToken(MenuItemTranslation),
    );
  });

  describe('createMenuItem', () => {
    it('should create a new menu item', async () => {
      const createMenuItemDto: CreateMenuItemDto = {
        id: 1,
        parentId: null,
        order: 1,
        isActive: true,
        translations: [{ language: 'en', title: 'Test Item', url: '/test' }],
      };
      const menu = { id: 1, name: 'Test Menu' };
      const menuItem = { id: 1, menu, parent: null, order: 1, isActive: true };
      const savedMenuItem = {
        ...menuItem,
        translations: createMenuItemDto.translations,
      };

      service.findOne = jest.fn().mockResolvedValue(menu);
      menuItemRepository.create.mockReturnValue(menuItem);
      menuItemRepository.save.mockResolvedValue(savedMenuItem);
      menuItemTranslationRepository.create.mockImplementation(
        (translation) => translation,
      );
      menuItemTranslationRepository.save.mockResolvedValue(
        createMenuItemDto.translations,
      );

      expect(await service.createMenuItem(createMenuItemDto)).toEqual(
        savedMenuItem,
      );
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(menuItemRepository.create).toHaveBeenCalledWith({
        menu,
        parent: null,
        order: 1,
        isActive: true,
      });
      expect(menuItemRepository.save).toHaveBeenCalledWith(menuItem);
      expect(menuItemTranslationRepository.create).toHaveBeenCalledTimes(1);
      expect(menuItemTranslationRepository.save).toHaveBeenCalledWith(
        createMenuItemDto.translations.map((translation) => ({
          menuItem: savedMenuItem,
          ...translation,
        })),
      );
    });
  });

  describe('findAllMenuItems', () => {
    it('should return all menu items for a specific menu', async () => {
      const menuItems = [{ id: 1, order: 1, isActive: true }];
      menuItemRepository.find.mockResolvedValue(menuItems);

      expect(await service.findAllMenuItems(1)).toEqual(menuItems);
      expect(menuItemRepository.find).toHaveBeenCalledWith({
        where: { menu: { id: 1 } },
        relations: ['parent', 'children', 'translations'],
        order: { order: 'ASC' },
      });
    });
  });

  describe('findMenuItemById', () => {
    it('should return a menu item by ID', async () => {
      const menuItem = { id: 1, order: 1, isActive: true };
      menuItemRepository.findOne.mockResolvedValue(menuItem);

      expect(await service.findMenuItemById(1)).toEqual(menuItem);
      expect(menuItemRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['parent', 'children', 'translations'],
      });
    });

    it('should throw a NotFoundException if menu item not found', async () => {
      menuItemRepository.findOne.mockResolvedValue(null);

      await expect(service.findMenuItemById(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateMenuItem', () => {
    it('should update a menu item by ID', async () => {
      const updateMenuItemDto: UpdateMenuItemDto = {
        id: 1,
        parentId: null,
        order: 2,
        isActive: false,
        translations: [
          { language: 'en', title: 'Updated Item', url: '/updated' },
        ],
      };
      const menuItem = { id: 1, order: 1, isActive: true };
      const updatedMenuItem = { ...menuItem, ...updateMenuItemDto };

      service.findMenuItemById = jest.fn().mockResolvedValue(menuItem);
      menuItemRepository.save.mockResolvedValue(updatedMenuItem);
      menuItemTranslationRepository.delete.mockResolvedValue(undefined);
      menuItemTranslationRepository.create.mockImplementation(
        (translation) => translation,
      );
      menuItemTranslationRepository.save.mockResolvedValue(
        updateMenuItemDto.translations,
      );

      expect(await service.updateMenuItem(1, updateMenuItemDto)).toEqual(
        updatedMenuItem,
      );
      expect(service.findMenuItemById).toHaveBeenCalledWith(1);
      expect(menuItemRepository.save).toHaveBeenCalledWith(menuItem);
      expect(menuItemTranslationRepository.delete).toHaveBeenCalledWith({
        menuItem: { id: 1 },
      });
      expect(menuItemTranslationRepository.create).toHaveBeenCalledTimes(1);
      expect(menuItemTranslationRepository.save).toHaveBeenCalledWith(
        updateMenuItemDto.translations.map((translation) => ({
          menuItem: updatedMenuItem,
          ...translation,
        })),
      );
    });
  });

  describe('removeMenuItem', () => {
    it('should remove a menu item by ID', async () => {
      const menuItem = { id: 1, order: 1, isActive: true };

      service.findMenuItemById = jest.fn().mockResolvedValue(menuItem);
      menuItemRepository.remove.mockResolvedValue(menuItem);

      await service.removeMenuItem(1);
      expect(service.findMenuItemById).toHaveBeenCalledWith(1);
      expect(menuItemRepository.remove).toHaveBeenCalledWith(menuItem);
    });
  });
});
