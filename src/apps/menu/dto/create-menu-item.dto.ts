import {
  IsInt,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateMenuItemTranslationDto } from './create-menu-item-translation.dto';

export class CreateMenuItemDto {
  @IsInt()
  id: number; // The ID of the menu this item belongs to

  @IsOptional()
  @IsInt()
  parentId?: number; // The ID of the parent menu item (if any)

  @IsInt()
  order: number; // The order of the menu item

  @IsBoolean()
  @IsOptional()
  isActive?: boolean; // Whether the menu item is active

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMenuItemTranslationDto)
  translations: CreateMenuItemTranslationDto[];
}
