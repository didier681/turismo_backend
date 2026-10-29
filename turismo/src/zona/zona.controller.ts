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
import { CreateZonaDto } from './dto/create-zona.dto';
import { UpdateZonaDto } from './dto/update-zona.dto';
import { ZonaService } from './zona.service';
import { Zona } from './entities/zona.entity';

@Controller('zonas')
// Expone las operaciones HTTP para administrar zonas.
export class ZonaController {
  constructor(private readonly zonaService: ZonaService) {}

  @Post()
  create(@Body() dto: CreateZonaDto): Promise<Zona> {
    return this.zonaService.create(dto);
  }

  @Get()
  findAll(): Promise<Zona[]> {
    return this.zonaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Zona> {
    return this.zonaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateZonaDto,
  ): Promise<Zona> {
    return this.zonaService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.zonaService.remove(id);
  }
}
