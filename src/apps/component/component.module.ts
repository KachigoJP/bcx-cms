import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComponentEntity } from './entity/component.entity';
import { ComponentService } from './component.service';
import { ComponentController } from './component.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ComponentEntity])],
  providers: [ComponentService],
  controllers: [ComponentController],
  exports: [ComponentService],
})
export class ComponentModule {}
