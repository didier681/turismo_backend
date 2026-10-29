import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { SitioTuristico } from './entities/sitio-turistico.entity';
import { CreateSitioTuristicoDto } from './dto/create-sitio-turistico.dto';
import { UpdateSitioTuristicoDto } from './dto/update-sitio-turistico.dto';
import { SitioTuristicoService } from './sitio-turistico.service';

@Controller('sitios-turisticos')
// Expone el CRUD de sitios turísticos mediante la API REST.
export class SitioTuristicoController {
  constructor(private readonly sitioService: SitioTuristicoService) {}

  @Post()
  create(@Body() dto: CreateSitioTuristicoDto): Promise<SitioTuristico> {
    return this.sitioService.create(dto);
  }

  @Get()
  findAll(): Promise<SitioTuristico[]> {
    return this.sitioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<SitioTuristico> {
    return this.sitioService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSitioTuristicoDto,
  ): Promise<SitioTuristico> {
    return this.sitioService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.sitioService.remove(id);
  }
}
