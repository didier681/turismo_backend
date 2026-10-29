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
import { CreateFavoritoDto } from './dto/create-favorito.dto';
import { UpdateFavoritoDto } from './dto/update-favorito.dto';
import { Favorito } from './entities/favorito.entity';
import { FavoritoService } from './favorito.service';

@Controller('favoritos')
// Expone operaciones de favoritos identificados por usuario y sitio.
export class FavoritoController {
  constructor(private readonly favoritoService: FavoritoService) {}

  @Post()
  create(@Body() dto: CreateFavoritoDto): Promise<Favorito> {
    return this.favoritoService.create(dto);
  }

  @Get()
  findAll(): Promise<Favorito[]> {
    return this.favoritoService.findAll();
  }

  @Get(':idUsuario/:idSitio')
  findOne(
    @Param('idUsuario', ParseIntPipe) idUsuario: number,
    @Param('idSitio', ParseIntPipe) idSitio: number,
  ): Promise<Favorito> {
    return this.favoritoService.findOne(idUsuario, idSitio);
  }

  @Patch(':idUsuario/:idSitio')
  update(
    @Param('idUsuario', ParseIntPipe) idUsuario: number,
    @Param('idSitio', ParseIntPipe) idSitio: number,
    @Body() dto: UpdateFavoritoDto,
  ): Promise<Favorito> {
    return this.favoritoService.update(idUsuario, idSitio, dto);
  }

  @Delete(':idUsuario/:idSitio')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('idUsuario', ParseIntPipe) idUsuario: number,
    @Param('idSitio', ParseIntPipe) idSitio: number,
  ): Promise<void> {
    return this.favoritoService.remove(idUsuario, idSitio);
  }
}
