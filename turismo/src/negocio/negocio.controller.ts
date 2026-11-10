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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { User } from '../user/entities/user.entity';
import { CreateNegocioDto } from './dto/create-negocio.dto';
import { UpdateNegocioDto } from './dto/update-negocio.dto';
import { Negocio } from './entities/negocio.entity';
import { NegocioService } from './negocio.service';

@Controller('negocios')
@ApiTags('Negocio')
// Expone las operaciones CRUD de los negocios turísticos.
export class NegocioController {
  // Inyecta el servicio que gestiona los negocios.
  constructor(private readonly negocioService: NegocioService) {}

  // Crea un negocio con los datos validados de la solicitud.
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('negocio', 'admin')
  @ApiBearerAuth()
  @ApiBadRequestResponse({
    description: 'La latitud o longitud está fuera del rango permitido.',
  })
  @ApiConflictResponse({
    description: 'Ya existe un negocio registrado con ese NIT o documento.',
  })
  @ApiNotFoundResponse({ description: 'La zona o el sitio indicado no existe.' })
  create(
    @Body() dto: CreateNegocioDto,
    @GetUser() user: User,
  ): Promise<Negocio> {
    return this.negocioService.create(dto, user);
  }

  // Devuelve todos los negocios con sus relaciones.
  @Get()
  findAll(): Promise<Negocio[]> {
    return this.negocioService.findAll();
  }

  // Busca un negocio por su identificador.
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Negocio> {
    return this.negocioService.findOne(id);
  }

  // Actualiza parcialmente el negocio indicado.
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('negocio', 'admin')
  @ApiBearerAuth()
  @ApiBadRequestResponse({
    description: 'La latitud o longitud está fuera del rango permitido.',
  })
  @ApiConflictResponse({
    description: 'Ya existe un negocio registrado con ese NIT o documento.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNegocioDto,
    @GetUser() user: User,
  ): Promise<Negocio> {
    return this.negocioService.update(id, dto, user);
  }

  // Elimina el negocio indicado y responde sin contenido.
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('negocio', 'admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.negocioService.remove(id, user);
  }
}
