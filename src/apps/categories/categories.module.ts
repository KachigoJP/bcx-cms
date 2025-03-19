import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Source
import { CategoryEntity } from './entity/index';
import MainService from './categories.service';
import MainController from './categories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [MainController],
  providers: [MainService],
})
export default class MainModule {}
