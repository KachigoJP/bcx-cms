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
import { LIMIT_PAGE } from '../../config/constants';
import { CreateDto, UpdateDto } from './dto';
import { LanguageEntity } from './entity/language.entity';
import { MESSAGES } from '@messages/index';

@Injectable()
class MainService {
  constructor(
    @InjectRepository(LanguageEntity)
    private readonly mainRepo: Repository<LanguageEntity>,
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

  async findAll(query) {
    try {
      const { page = 1, limit } = query;
      const skip = (page - 1) * LIMIT_PAGE;

      const [result, total] = await this.mainRepo.findAndCount({
        order: { name: 'ASC' },
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
      throw new HttpException('Error:' + e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string) {
    try {
      return await this.mainRepo.findOne({ where: { id } });
    } catch (e) {
      throw new HttpException('Error:' + e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async create(dto: CreateDto) {
    try {
      await this.mainRepo.save(dto);

      return {
        message: MESSAGES.SUCCESS,
      };
    } catch (e) {
      throw new HttpException('Error:' + e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, dto: UpdateDto) {
    try {
      const entityFound = await this.mainRepo.findOneBy({ id });

      if (!entityFound)
        throw new HttpException(
          MESSAGES.MSG_NOT_FOUND('Page Tags'),
          HttpStatus.BAD_REQUEST,
        );

      await this.mainRepo.save({
        id,
        ...dto,
      });

      return {
        message: MESSAGES.SUCCESS,
      };
    } catch (e) {
      throw new HttpException('Error:' + e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    try {
      await this.mainRepo.softDelete(id);

      return {
        message: MESSAGES.SUCCESS,
      };
    } catch (e) {
      throw new HttpException('Error:' + e.message, HttpStatus.BAD_REQUEST);
    }
  }
}

export default MainService;
