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
  constructor(private readonly service: NegocioCategoriaService) {}

  @Post()
  create(
    @Body() dto: CreateNegocioCategoriaDto,
  ): Promise<NegocioCategoria> {
    return this.service.create(dto);
  }

  @Get()
  findAll(): Promise<NegocioCategoria[]> {
    return this.service.findAll();
  }

  @Get(':idNegocio/:idCategoriaNeg')
  findOne(
    @Param('idNegocio', ParseIntPipe) idNegocio: number,
    @Param('idCategoriaNeg', ParseIntPipe) idCategoriaNeg: number,
  ): Promise<NegocioCategoria> {
    return this.service.findOne(idNegocio, idCategoriaNeg);
  }

  @Patch(':idNegocio/:idCategoriaNeg')
  update(
    @Param('idNegocio', ParseIntPipe) idNegocio: number,
    @Param('idCategoriaNeg', ParseIntPipe) idCategoriaNeg: number,
    @Body() dto: UpdateNegocioCategoriaDto,
  ): Promise<NegocioCategoria> {
    return this.service.update(idNegocio, idCategoriaNeg, dto);
  }

  @Delete(':idNegocio/:idCategoriaNeg')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('idNegocio', ParseIntPipe) idNegocio: number,
    @Param('idCategoriaNeg', ParseIntPipe) idCategoriaNeg: number,
  ): Promise<void> {
    return this.service.remove(idNegocio, idCategoriaNeg);
  }
}
