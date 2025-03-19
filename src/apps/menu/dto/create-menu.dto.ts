import { IsString, IsBoolean, IsOptional, Length } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  @Length(1, 255)
  name: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
