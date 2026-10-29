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
import { CategoriaSitio } from './entities/categoria-sitio.entity';
import { CreateCategoriaSitioDto } from './dto/create-categoria-sitio.dto';
import { UpdateCategoriaSitioDto } from './dto/update-categoria-sitio.dto';
import { CategoriaSitioService } from './categoria-sitio.service';

@Controller('categorias-sitio')
// Expone el CRUD de las categorías de sitios.
export class CategoriaSitioController {
  constructor(private readonly categoriaService: CategoriaSitioService) {}

  @Post()
  create(@Body() dto: CreateCategoriaSitioDto): Promise<CategoriaSitio> {
    return this.categoriaService.create(dto);
  }

  @Get()
  findAll(): Promise<CategoriaSitio[]> {
    return this.categoriaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<CategoriaSitio> {
    return this.categoriaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoriaSitioDto,
  ): Promise<CategoriaSitio> {
    return this.categoriaService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoriaService.remove(id);
  }
}
