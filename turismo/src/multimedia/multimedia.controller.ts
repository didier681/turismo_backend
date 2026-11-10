import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { User } from '../user/entities/user.entity';
import { CreateMultimediaDto } from './dto/create-multimedia.dto';
import { UpdateMultimediaDto } from './dto/update-multimedia.dto';
import {
  Multimedia,
  TipoEntidadMultimedia,
} from './entities/multimedia.entity';
import { MultimediaService } from './multimedia.service';

@Controller('multimedia')
@ApiTags('Multimedia')
// Expone las operaciones CRUD y consultas de contenido multimedia.
export class MultimediaController {
  // Inyecta el servicio que administra el contenido multimedia.
  constructor(private readonly multimediaService: MultimediaService) {}

  // Crea contenido multimedia con los datos validados de la solicitud.
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('negocio', 'admin')
  @ApiBearerAuth()
  @ApiBadRequestResponse({
    description: 'El sitio o negocio ya tiene 10 archivos multimedia.',
  })
  @ApiForbiddenResponse({
    description: 'No tienes permiso para gestionar multimedia de esta entidad.',
  })
  @ApiNotFoundResponse({ description: 'El sitio o negocio indicado no existe.' })
  create(
    @Body() dto: CreateMultimediaDto,
    @GetUser() user: User,
  ): Promise<Multimedia> {
    return this.multimediaService.create(dto, user);
  }

  // Devuelve todo el contenido multimedia ordenado por su posición.
  @Get()
  findAll(): Promise<Multimedia[]> {
    return this.multimediaService.findAll();
  }

  // Lista por tipo e identificador el contenido ordenado de una entidad.
  @Get('entidad/:tipoEntidad/:idEntidad')
  findByEntidad(
    @Param('tipoEntidad', new ParseEnumPipe(TipoEntidadMultimedia))
    tipoEntidad: TipoEntidadMultimedia,
    @Param('idEntidad', ParseIntPipe) idEntidad: number,
  ): Promise<Multimedia[]> {
    return this.multimediaService.findByEntidad(tipoEntidad, idEntidad);
  }

  // Busca un registro multimedia por su identificador.
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Multimedia> {
    return this.multimediaService.findOne(id);
  }

  // Actualiza parcialmente el contenido multimedia indicado.
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('negocio', 'admin')
  @ApiBearerAuth()
  @ApiBadRequestResponse({
    description: 'El sitio o negocio ya tiene 10 archivos multimedia.',
  })
  @ApiForbiddenResponse({
    description: 'No tienes permiso para gestionar multimedia de esta entidad.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMultimediaDto,
    @GetUser() user: User,
  ): Promise<Multimedia> {
    return this.multimediaService.update(id, dto, user);
  }

  // Elimina el registro multimedia indicado y responde sin contenido.
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('negocio', 'admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.multimediaService.remove(id, user);
  }
}
