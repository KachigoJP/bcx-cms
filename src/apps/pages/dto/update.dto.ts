import { PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { MESSAGES } from '@messages/index';
import { CreateDto, PageTranslationDto, PageComponentDto } from './create.dto';

export class UpdateDto extends PartialType(CreateDto) {
  @IsString()
  @IsNotEmpty({
    message: MESSAGES.MSG_001('ID'),
  })
  @MaxLength(255, {
    message: MESSAGES.MSG_MAX_LENGTH({
      field: 'ID',
      maxValue: 255,
    }),
  })
  @Transform(({ value }) => value.trim())
  id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PageTranslationDto)
  @IsOptional()
  translations?: PageTranslationDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PageComponentDto)
  @IsOptional()
  pageComponents?: PageComponentDto[];
}
