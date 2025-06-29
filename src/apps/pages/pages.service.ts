import { Like, Repository } from 'typeorm';
import {
  Injectable,
  forwardRef,
  Inject,
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Source
import { MESSAGES } from '@messages/index';
import { LIMIT_PAGE } from '@config/constants';
import { CategoryEntity } from '@apps/categories/entity';
import { TagEntity } from '@apps/tags/entity';
import { CreateDto, UpdateDto } from './dto';
import { PageEntity } from './entity/index';
import { LanguageEntity } from '@apps/languages/entity';

// Sample Data
// import * as SampleData from '../../../test/data/settings.json';

@Injectable()
class MainService {
  constructor(
    @InjectRepository(PageEntity)
    private readonly mainRepo: Repository<PageEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
    @InjectRepository(LanguageEntity)
    private readonly langRepo: Repository<LanguageEntity>,
  ) {}

  async onModuleInit() {
    try {
      // this.mainRepo.save(SampleData as unknown as PageEntity);
    } catch (ex) {
      console.error(ex);
    }
  }

  async findAll(query) {
    try {
      const { page = 1, limit } = query;
      const skip = (page - 1) * LIMIT_PAGE;

      const [result, total] = await this.mainRepo.findAndCount({
        order: { created_at: 'DESC' },
        take: limit,
        skip: skip,
      });

      return {
        data: result,
        page,
        pageSize: LIMIT_PAGE,
        totalPage: Math.ceil(total / LIMIT_PAGE),
        totalItem: total,
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string) {
    try {
      const result = await this.mainRepo.findOne({
        where: { id },
      });

      return {
        data: result,
        message: MESSAGES.SUCCESS,
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async create(dto: CreateDto) {
    try {
      await this.mainRepo.save(dto);

      return {
        message: MESSAGES.SUCCESS,
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, dto: UpdateDto) {
    try {
      const entityFound = await this.mainRepo.findOneBy({ id });

      if (!entityFound)
        throw new HttpException(
          MESSAGES.MSG_NOT_FOUND('Setting'),
          HttpStatus.BAD_REQUEST,
        );

      await this.mainRepo.save({
        id,
        ...dto,
      });

      return {
        message: MESSAGES.SUCCESS,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    try {
      await this.mainRepo.softDelete(id);

      return {
        message: MESSAGES.SUCCESS,
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async options() {
    try {
      const categories = await this.categoryRepo.find({
        select: {
          id: true,
          name: true,
        },
      });

      const languages = await this.langRepo.find({
        select: {
          id: true,
          name: true,
        },
      });

      return {
        data: {
          categories: categories.map((item) => {
            return { value: item.id, label: item.name };
          }),
          languages: languages.map((item) => {
            return { value: item.id, label: item.name };
          }),
        },
        message: MESSAGES.SUCCESS,
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}

export default MainService;
