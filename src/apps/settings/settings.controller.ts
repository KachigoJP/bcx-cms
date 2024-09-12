import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Delete,
  Put,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';

// Source
import MainService from './settings.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('settings')
class MainController {
  constructor(private readonly service: MainService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(@Query() query) {
    return this.service.findAll(query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() dto) {
    return this.service.create(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() dto) {
    return this.service.update(id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

export default MainController;
