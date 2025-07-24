import { PartialType } from '@nestjs/swagger';
import { CreateComponentDto } from './create-component.dto';
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateComponentDto extends PartialType(CreateComponentDto) {
  @ApiProperty({ example: 'uuid-of-component' })
  @IsString()
  @IsNotEmpty()
  id: string;
}
