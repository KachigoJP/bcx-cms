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
import { PageComponentEntity } from './entity/page-component.entity';
import { ComponentEntity } from './entity/component.entity';

@Injectable()
class MainService {
  constructor(
    @InjectRepository(PageEntity)
    private readonly mainRepo: Repository<PageEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
    @InjectRepository(LanguageEntity)
    private readonly langRepo: Repository<LanguageEntity>,
    @InjectRepository(PageComponentEntity)
    private readonly pageComponentRepo: Repository<PageComponentEntity>,
    @InjectRepository(ComponentEntity)
    private readonly componentRepo: Repository<ComponentEntity>,
  ) {}

  async initializeData(data) {
    // Check if data already exists (optional, but often a good idea)
    const existingData = await this.mainRepo.find();
    if (existingData.length > 0) {
      return;
    }

    // Save the data to the database
    await this.mainRepo.save(data);
  }

  async create(dto: CreateDto, language?: string) {
    try {
      let page = this.mainRepo.create(dto);

      // Handle translations
      if (language && dto.translations) {
        page.translations = dto.translations
          .filter((t) => t.language === language)
          .map((t) =>
            this.mainRepo.manager.create('PageTranslationEntity', {
              ...t,
              language,
              page,
            }),
          );
      }

      await this.mainRepo.save(page);

      return {
        message: MESSAGES.SUCCESS,
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, dto: UpdateDto, language?: string) {
    try {
      const entityFound = await this.mainRepo.findOne({
        where: { id },
        relations: [
          'translations',
          'pageComponents',
          'pageComponents.component',
        ],
      });

      if (!entityFound)
        throw new HttpException(
          MESSAGES.MSG_NOT_FOUND('Setting'),
          HttpStatus.BAD_REQUEST,
        );

      if (language) {
        // Update translation for the given language
        let translation = entityFound.translations.find(
          (t) => t.language === language,
        );
        if (translation) {
          Object.assign(translation, dto);
        } else {
          translation = this.mainRepo.manager.create('PageTranslationEntity', {
            ...dto,
            language,
            page: entityFound,
          });
          entityFound.translations.push(translation);
        }
        await this.mainRepo.manager.save(entityFound.translations);
      } else {
        // Update main entity fields
        await this.mainRepo.save({
          id,
          ...dto,
        });
      }

      return {
        message: MESSAGES.SUCCESS,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(query, language?: string) {
    try {
      const { page = 1, limit } = query;
      const skip = (page - 1) * LIMIT_PAGE;

      const [result, total] = await this.mainRepo.findAndCount({
        order: { created_at: 'DESC' },
        take: limit,
        skip: skip,
        relations: [
          'translations',
          'pageComponents',
          'pageComponents.component',
        ],
      });

      // If language is specified, filter translations
      const data = result.map((pageItem) => {
        if (language && pageItem.translations) {
          pageItem.translations = pageItem.translations.filter(
            (t) => t.language === language,
          );
        }
        return pageItem;
      });

      return {
        data,
        page,
        pageSize: LIMIT_PAGE,
        totalPage: Math.ceil(total / LIMIT_PAGE),
        totalItem: total,
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string, language?: string) {
    try {
      const result = await this.mainRepo.findOne({
        where: { id },
        relations: [
          'translations',
          'pageComponents',
          'pageComponents.component',
        ],
      });

      if (language && result && result.translations) {
        result.translations = result.translations.filter(
          (t) => t.language === language,
        );
      }

      return {
        data: result,
        message: MESSAGES.SUCCESS,
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
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
