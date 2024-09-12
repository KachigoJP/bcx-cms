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
import { AuthGuard } from '@nestjs/passport';

// Source
import MainService from './pages.service';

@Controller('pages')
class MainController {
  constructor(private readonly service: MainService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('options')
  @HttpCode(HttpStatus.OK)
  options() {
    return this.service.options();
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(@Query() query) {
    return this.service.findAll(query);
  }

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
