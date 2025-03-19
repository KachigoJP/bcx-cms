import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Source
import { SEOEntity } from './entity/index';
import MainService from './seo.service';
import MainController from './seo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SEOEntity])],
  controllers: [MainController],
  providers: [MainService],
})
export default class MainModule {}
