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
import { CreateCategoriaNegocioDto } from './dto/create-categoria-negocio.dto';
import { UpdateCategoriaNegocioDto } from './dto/update-categoria-negocio.dto';
import { CategoriaNegocio } from './entities/categoria-negocio.entity';
import { CategoriaNegocioService } from './categoria-negocio.service';

@Controller('categorias-negocio')
// Expone las operaciones CRUD de las categorías de negocio.
export class CategoriaNegocioController {
  constructor(private readonly categoriaService: CategoriaNegocioService) {}

  @Post()
  create(
    @Body() dto: CreateCategoriaNegocioDto,
  ): Promise<CategoriaNegocio> {
    return this.categoriaService.create(dto);
  }

  @Get()
  findAll(): Promise<CategoriaNegocio[]> {
    return this.categoriaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<CategoriaNegocio> {
    return this.categoriaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoriaNegocioDto,
  ): Promise<CategoriaNegocio> {
    return this.categoriaService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoriaService.remove(id);
  }
}
