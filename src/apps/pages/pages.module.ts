import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Source
import { PageCategoryEntity } from '@apps/categories/entity';
import { LanguageEntity } from '@apps/languages/entity';
import { PageEntity } from './entity/index';
import MainService from './pages.service';
import MainController from './pages.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PageEntity, PageCategoryEntity, LanguageEntity]),
  ],
  controllers: [MainController],
  providers: [MainService],
})
export default class MainModule {}
