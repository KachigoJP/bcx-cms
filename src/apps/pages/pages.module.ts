import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Source
import { CategoryEntity } from '@apps/categories/entity';
import { TagEntity } from '@apps/tags/entity';
import { LanguageEntity } from '@apps/languages/entity';
import { PageEntity } from './entity/index';
import MainService from './pages.service';
import MainController from './pages.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PageEntity,
      CategoryEntity,
      TagEntity,
      LanguageEntity,
    ]),
  ],
  controllers: [MainController],
  providers: [MainService],
})
export default class MainModule {}
