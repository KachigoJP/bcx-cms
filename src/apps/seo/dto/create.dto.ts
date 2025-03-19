import { MaxLength, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { MESSAGES } from '@messages/index';

export class CreateDto {
  @IsString()
  @IsNotEmpty({
    message: MESSAGES.MSG_001('Name'),
  })
  @MaxLength(255, {
    message: MESSAGES.MSG_MAX_LENGTH({
      field: 'Name',
      maxValue: 255,
    }),
  })
  @Transform(({ value }) => value.trim())
  name: string;

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
      field: 'Description',
      maxValue: 1000,
    }),
  })
  @Transform(({ value }) => value.trim())
  description: string;
}
