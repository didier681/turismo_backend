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
import { SitioCategoria } from './entities/sitio-categoria.entity';
import { CreateSitioCategoriaDto } from './dto/create-sitio-categoria.dto';
import { UpdateSitioCategoriaDto } from './dto/update-sitio-categoria.dto';
import { SitioCategoriaService } from './sitio-categoria.service';

@Controller('sitio-categoria')
// Expone el CRUD de la relación N:M mediante sus dos claves.
export class SitioCategoriaController {
  constructor(private readonly associationService: SitioCategoriaService) {}

  @Post()
  create(@Body() dto: CreateSitioCategoriaDto): Promise<SitioCategoria> {
    return this.associationService.create(dto);
  }

  @Get()
  findAll(): Promise<SitioCategoria[]> {
    return this.associationService.findAll();
  }

  @Get(':idSitio/:idCategoria')
  findOne(
    @Param('idSitio', ParseIntPipe) idSitio: number,
    @Param('idCategoria', ParseIntPipe) idCategoria: number,
  ): Promise<SitioCategoria> {
    return this.associationService.findOne(idSitio, idCategoria);
  }

  @Patch(':idSitio/:idCategoria')
  update(
    @Param('idSitio', ParseIntPipe) idSitio: number,
    @Param('idCategoria', ParseIntPipe) idCategoria: number,
    @Body() dto: UpdateSitioCategoriaDto,
  ): Promise<SitioCategoria> {
    return this.associationService.update(idSitio, idCategoria, dto);
  }

  @Delete(':idSitio/:idCategoria')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('idSitio', ParseIntPipe) idSitio: number,
    @Param('idCategoria', ParseIntPipe) idCategoria: number,
  ): Promise<void> {
    return this.associationService.remove(idSitio, idCategoria);
  }
}
