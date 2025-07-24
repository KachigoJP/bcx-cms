import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ComponentTranslationDto {
  @ApiProperty({ example: 'en' })
  @IsString()
  language: string;

  @ApiProperty({ example: 'Banner', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ type: 'object', required: false })
  @IsOptional()
  config?: Record<string, any>;
}

export class CreateComponentDto {
  @ApiProperty({ example: 'Banner' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'banner' })
  @IsString()
  type: string;

  @ApiProperty({ type: 'object', required: false })
  @IsOptional()
  defaultConfig?: Record<string, any>;

  @ApiProperty({ type: [ComponentTranslationDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComponentTranslationDto)
  @IsOptional()
  translations?: ComponentTranslationDto[];
}
