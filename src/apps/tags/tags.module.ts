import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Source
import { TagEntity } from './entity/index';
import MainService from './tags.service';
import MainController from './tags.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity])],
  controllers: [MainController],
  providers: [MainService],
})
export default class MainModule {}
