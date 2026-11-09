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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
  create(@Body() dto: CreateMultimediaDto): Promise<Multimedia> {
    return this.multimediaService.create(dto);
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMultimediaDto,
  ): Promise<Multimedia> {
    return this.multimediaService.update(id, dto);
  }

  // Elimina el registro multimedia indicado y responde sin contenido.
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.multimediaService.remove(id);
  }
}
