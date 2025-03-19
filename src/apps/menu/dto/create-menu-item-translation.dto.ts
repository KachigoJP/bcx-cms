import { IsString, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateMenuItemTranslationDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 10)
  language: string; // Language code (e.g., 'en', 'fr')

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  title: string; // Label of the menu item in the specific language

  @IsString()
  @IsOptional()
  @Length(1, 255)
  url?: string; // URL of the menu item
}
