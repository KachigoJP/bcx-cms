import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ComponentService } from './component.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';

@ApiTags('components')
@Controller('components')
export class ComponentController {
  constructor(private readonly componentService: ComponentService) {}

  @Post()
  @ApiOperation({ summary: 'Create component' })
  @ApiResponse({ status: 201, description: 'Component created' })
  create(@Body() dto: CreateComponentDto) {
    return this.componentService.createComponent(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List components' })
  list() {
    return this.componentService.listComponents();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get component by id' })
  get(@Param('id') id: string) {
    return this.componentService.getComponent(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update component' })
  update(@Param('id') id: string, @Body() dto: UpdateComponentDto) {
    return this.componentService.updateComponent(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete component' })
  remove(@Param('id') id: string) {
    return this.componentService.deleteComponent(id);
  }
}
