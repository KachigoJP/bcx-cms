import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Source
import { SeoEntity } from './entity/index';
import MainService from './seo.service';
import MainController from './seo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SeoEntity])],
  controllers: [MainController],
  providers: [MainService],
})
export default class MainModule {}
