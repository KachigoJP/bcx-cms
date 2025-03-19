import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { MenuService } from '../menu.service';
import { Menu } from '../entities/menu.entity';
import { MenuItem } from '../entities/menu-item.entity';
import { MenuItemTranslation } from '../entities/menu-item-translation.entity';
import { CreateMenuDto, UpdateMenuDto } from '../dto';

describe('MenuService', () => {
  let service: MenuService;
  let menuRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        {
          provide: getRepositoryToken(Menu),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new menu', async () => {
      const createMenuDto: CreateMenuDto = { name: 'Test Menu' };
      const menu = { id: 1, ...createMenuDto };

      menuRepository.create.mockReturnValue(menu);
      menuRepository.save.mockResolvedValue(menu);

      expect(await service.create(createMenuDto)).toEqual(menu);
      expect(menuRepository.create).toHaveBeenCalledWith(createMenuDto);
      expect(menuRepository.save).toHaveBeenCalledWith(menu);
    });
  });

  describe('findAll', () => {
    it('should return an array of menus', async () => {
      const menus = [{ id: 1, name: 'Test Menu' }];
      menuRepository.find.mockResolvedValue(menus);

      expect(await service.findAll()).toEqual(menus);
      expect(menuRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a menu by ID', async () => {
      const menu = { id: 1, name: 'Test Menu' };
      menuRepository.findOne.mockResolvedValue(menu);

      expect(await service.findOne(1)).toEqual(menu);
      expect(menuRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['items'],
      });
    });

    it('should throw a NotFoundException if menu not found', async () => {
      menuRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a menu by ID', async () => {
      const updateMenuDto: UpdateMenuDto = { name: 'Updated Menu' };
      const menu = { id: 1, name: 'Test Menu' };
      const updatedMenu = { ...menu, ...updateMenuDto };

      service.findOne = jest.fn().mockResolvedValue(menu);
      menuRepository.save.mockResolvedValue(updatedMenu);

      expect(await service.update(1, updateMenuDto)).toEqual(updatedMenu);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(menuRepository.save).toHaveBeenCalledWith(updatedMenu);
    });
  });

  describe('remove', () => {
    it('should remove a menu by ID', async () => {
      const menu = { id: 1, name: 'Test Menu' };

      service.findOne = jest.fn().mockResolvedValue(menu);
      menuRepository.remove.mockResolvedValue(menu);

      await service.remove(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(menuRepository.remove).toHaveBeenCalledWith(menu);
    });
  });
});
