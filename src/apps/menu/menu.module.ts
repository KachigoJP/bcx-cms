import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Source
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

import { MenuEntity } from './entities/menu.entity';
import { MenuItemEntity } from './entities/menu-item.entity';
import { MenuItemTranslationEntity } from './entities/menu-item-translation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MenuEntity,
      MenuItemEntity,
      MenuItemTranslationEntity,
    ]),
  ],
  controllers: [MenuController],
  providers: [MenuService],
})
export default class MenuModule {}
