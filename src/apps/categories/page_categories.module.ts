import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Source
import { PageCategoryEntity } from './entity/index';
import MainService from './page_categories.service';
import MainController from './page_categories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PageCategoryEntity])],
  controllers: [MainController],
  providers: [MainService],
})
export default class MainModule {}
