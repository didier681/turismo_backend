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
import { CreatePublicidadDto } from './dto/create-publicidad.dto';
import { UpdatePublicidadDto } from './dto/update-publicidad.dto';
import { Publicidad } from './entities/publicidad.entity';
import { PublicidadService } from './publicidad.service';

@Controller('publicidades')
@ApiTags('Publicidad')
// Expone las operaciones CRUD de las campañas publicitarias.
export class PublicidadController {
  // Inyecta el servicio que administra las publicidades.
  constructor(private readonly publicidadService: PublicidadService) {}

  // Crea una publicidad con los datos validados de la solicitud.
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('negocio', 'admin')
  @ApiBearerAuth()
  create(
    @Body() dto: CreatePublicidadDto,
    @GetUser() user: User,
  ): Promise<Publicidad> {
    return this.publicidadService.create(dto, user);
  }

  // Devuelve todas las publicidades y sus referencias.
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll(): Promise<Publicidad[]> {
    return this.publicidadService.findAll();
  }

  // Busca una publicidad por su identificador.
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Publicidad> {
    return this.publicidadService.findOne(id);
  }

  // Actualiza parcialmente la publicidad indicada.
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('negocio', 'admin')
  @ApiBearerAuth()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePublicidadDto,
    @GetUser() user: User,
  ): Promise<Publicidad> {
    return this.publicidadService.update(id, dto, user);
  }

  // Elimina la publicidad indicada y responde sin contenido.
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('negocio', 'admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.publicidadService.remove(id, user);
  }
}
