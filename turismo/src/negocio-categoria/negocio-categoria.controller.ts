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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { User } from '../user/entities/user.entity';
import { CreateNegocioCategoriaDto } from './dto/create-negocio-categoria.dto';
import { UpdateNegocioCategoriaDto } from './dto/update-negocio-categoria.dto';
import { NegocioCategoria } from './entities/negocio-categoria.entity';
import { NegocioCategoriaService } from './negocio-categoria.service';

@Controller('negocio-categorias')
@ApiTags('NegocioCategoria')
// Expone el CRUD de asociaciones entre negocios y categorías.
export class NegocioCategoriaController {
  // Inyecta el servicio que administra las asociaciones.
  constructor(private readonly service: NegocioCategoriaService) {}

  // Crea una asociación después de validar sus claves relacionadas.
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('negocio', 'admin')
  @ApiBearerAuth()
  create(
    @Body() dto: CreateNegocioCategoriaDto,
    @GetUser() user: User,
  ): Promise<NegocioCategoria> {
    return this.service.create(dto, user);
  }

  // Devuelve las asociaciones con negocio y categoría.
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll(): Promise<NegocioCategoria[]> {
    return this.service.findAll();
  }

  // Busca una asociación mediante la pareja de identificadores.
  @Get(':idNegocio/:idCategoriaNeg')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(
    @Param('idNegocio', ParseIntPipe) idNegocio: number,
    @Param('idCategoriaNeg', ParseIntPipe) idCategoriaNeg: number,
  ): Promise<NegocioCategoria> {
    return this.service.findOne(idNegocio, idCategoriaNeg);
  }

  // Actualiza la pareja de identificadores de una asociación.
  @Patch(':idNegocio/:idCategoriaNeg')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('negocio', 'admin')
  @ApiBearerAuth()
  update(
    @Param('idNegocio', ParseIntPipe) idNegocio: number,
    @Param('idCategoriaNeg', ParseIntPipe) idCategoriaNeg: number,
    @Body() dto: UpdateNegocioCategoriaDto,
    @GetUser() user: User,
  ): Promise<NegocioCategoria> {
    return this.service.update(idNegocio, idCategoriaNeg, dto, user);
  }

  // Elimina una asociación sin borrar sus entidades relacionadas.
  @Delete(':idNegocio/:idCategoriaNeg')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('negocio', 'admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('idNegocio', ParseIntPipe) idNegocio: number,
    @Param('idCategoriaNeg', ParseIntPipe) idCategoriaNeg: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.service.remove(idNegocio, idCategoriaNeg, user);
  }
}
