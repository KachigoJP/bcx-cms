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
import ProviderEntity from './entity/provider.entity';

// Sample Data
import * as providerSample from '../../../test/data/provider.json';

@Injectable()
export default class MainService {
  constructor(
    @InjectRepository(ProviderEntity)
    private readonly mainRepo: Repository<ProviderEntity>,
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
      return await this.mainRepo.find();

      // const { page, limit, ...keyword } = query;
      // const skip = (page - 1) * LIMIT_PAGE;

      // console.log('GO HEERRR123', query);
      // const [result, total] = await this.providerRepo.findAndCount({
      //   where: { name: Like('%' + keyword + '%') },
      //   order: { name: 'DESC' },
      //   take: limit,
      //   skip: skip,
      // });

      // return {
      //   data: result,
      //   page,
      //   pageSize: LIMIT_PAGE,
      //   totalPage: Math.ceil(total / LIMIT_PAGE),
      //   totalItem: total,
      // };
    } catch (e) {
      throw new HttpException('Error:' + e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string) {
    try {
      return await this.mainRepo.findOne({ where: { id } });
    } catch (e) {
      throw new HttpException('Error', HttpStatus.BAD_REQUEST);
    }
  }

  async create(dto: CreateDto) {
    try {
      return {
        message: 'success',
      };
    } catch (e) {
      throw new HttpException('Error', HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, dto: UpdateDto) {
    try {
      return {
        message: 'success',
      };
    } catch (e) {
      throw new HttpException('error', HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    try {
      return await this.mainRepo.softDelete(id);
    } catch (e) {
      throw new HttpException('error', HttpStatus.BAD_REQUEST);
    }
  }
}
