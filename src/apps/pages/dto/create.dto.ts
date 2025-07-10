import { MaxLength, IsNotEmpty, IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { MESSAGES } from '@messages/index';

export class PageTranslationDto {
  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;
}

export class PageComponentDto {
  @IsString()
  @IsNotEmpty()
  componentId: string;

  @IsOptional()
  order?: number;

  @IsOptional()
  config?: Record<string, any>;
}

export class CreateDto {
  @IsString()
  @IsNotEmpty({
    message: MESSAGES.MSG_001('Title'),
  })
  @MaxLength(255, {
    message: MESSAGES.MSG_MAX_LENGTH({
      field: 'Title',
      maxValue: 255,
    }),
  })
  @Transform(({ value }) => value.trim())
  title: string;

  @IsString()
  @MaxLength(255, {
    message: MESSAGES.MSG_MAX_LENGTH({
      field: 'Slug',
      maxValue: 255,
    }),
  })
  @Transform(({ value }) => value.trim())
  slug: string;

  @IsString()
  @MaxLength(1000, {
    message: MESSAGES.MSG_MAX_LENGTH({
      field: 'Content',
      maxValue: 1000,
    }),
  })
  @Transform(({ value }) => value.trim())
  content: string;

  @IsString()
  @MaxLength(255, {
    message: MESSAGES.MSG_MAX_LENGTH({
      field: 'Description',
      maxValue: 255,
    }),
  })
  @Transform(({ value }) => value.trim())
  status: string;

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
