import { IsNumber, Min, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryNotificationDto {
  @Min(1)
  @IsNumber({}, { message: 'Not is number' })
  @Transform(({ value }) => Number(value))
  page: number;

  @Min(10)
  @IsNumber({}, { message: 'Not is number' })
  @Transform(({ value }) => Number(value))
  limit: number;
}

export class QueryDto {
  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
