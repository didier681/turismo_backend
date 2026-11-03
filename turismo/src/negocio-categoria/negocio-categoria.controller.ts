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
import { CreateNegocioCategoriaDto } from './dto/create-negocio-categoria.dto';
import { UpdateNegocioCategoriaDto } from './dto/update-negocio-categoria.dto';
import { NegocioCategoria } from './entities/negocio-categoria.entity';
import { NegocioCategoriaService } from './negocio-categoria.service';

@Controller('negocio-categorias')
// Expone el CRUD de asociaciones entre negocios y categorías.
export class NegocioCategoriaController {
  // Inyecta el servicio que administra las asociaciones.
  constructor(private readonly service: NegocioCategoriaService) {}

  // Crea una asociación después de validar sus claves relacionadas.
  @Post()
  create(
    @Body() dto: CreateNegocioCategoriaDto,
  ): Promise<NegocioCategoria> {
    return this.service.create(dto);
  }

  // Devuelve las asociaciones con negocio y categoría.
  @Get()
  findAll(): Promise<NegocioCategoria[]> {
    return this.service.findAll();
  }

  // Busca una asociación mediante la pareja de identificadores.
  @Get(':idNegocio/:idCategoriaNeg')
  findOne(
    @Param('idNegocio', ParseIntPipe) idNegocio: number,
    @Param('idCategoriaNeg', ParseIntPipe) idCategoriaNeg: number,
  ): Promise<NegocioCategoria> {
    return this.service.findOne(idNegocio, idCategoriaNeg);
  }

  // Actualiza la pareja de identificadores de una asociación.
  @Patch(':idNegocio/:idCategoriaNeg')
  update(
    @Param('idNegocio', ParseIntPipe) idNegocio: number,
    @Param('idCategoriaNeg', ParseIntPipe) idCategoriaNeg: number,
    @Body() dto: UpdateNegocioCategoriaDto,
  ): Promise<NegocioCategoria> {
    return this.service.update(idNegocio, idCategoriaNeg, dto);
  }

  // Elimina una asociación sin borrar sus entidades relacionadas.
  @Delete(':idNegocio/:idCategoriaNeg')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('idNegocio', ParseIntPipe) idNegocio: number,
    @Param('idCategoriaNeg', ParseIntPipe) idCategoriaNeg: number,
  ): Promise<void> {
    return this.service.remove(idNegocio, idCategoriaNeg);
  }
}
