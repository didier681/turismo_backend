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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { SitioCategoria } from './entities/sitio-categoria.entity';
import { CreateSitioCategoriaDto } from './dto/create-sitio-categoria.dto';
import { UpdateSitioCategoriaDto } from './dto/update-sitio-categoria.dto';
import { SitioCategoriaService } from './sitio-categoria.service';

@Controller('sitio-categoria')
@ApiTags('SitioCategoria')
// Expone el CRUD de la relación N:M mediante sus dos claves.
export class SitioCategoriaController {
  constructor(private readonly associationService: SitioCategoriaService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'gestor')
  @ApiBearerAuth()
  create(
    @Body() dto: CreateSitioCategoriaDto,
    @GetUser() user: User,
  ): Promise<SitioCategoria> {
    return this.associationService.create(dto, user);
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'gestor')
  @ApiBearerAuth()
  update(
    @Param('idSitio', ParseIntPipe) idSitio: number,
    @Param('idCategoria', ParseIntPipe) idCategoria: number,
    @Body() dto: UpdateSitioCategoriaDto,
    @GetUser() user: User,
  ): Promise<SitioCategoria> {
    return this.associationService.update(idSitio, idCategoria, dto, user);
  }

  @Delete(':idSitio/:idCategoria')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'gestor')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('idSitio', ParseIntPipe) idSitio: number,
    @Param('idCategoria', ParseIntPipe) idCategoria: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.associationService.remove(idSitio, idCategoria, user);
  }
}
