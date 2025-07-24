import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComponentEntity } from './entity/component.entity';
import { ComponentTranslationEntity } from './entity/component-translation.entity';
import { ComponentService } from './component.service';
import { ComponentController } from './component.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ComponentEntity, ComponentTranslationEntity]),
  ],
  providers: [ComponentService],
  controllers: [ComponentController],
  exports: [ComponentService],
})
export class ComponentModule {}
