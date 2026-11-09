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
import { ApiTags } from '@nestjs/swagger';
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
  create(@Body() dto: CreatePublicidadDto): Promise<Publicidad> {
    return this.publicidadService.create(dto);
  }

  // Devuelve todas las publicidades y sus referencias.
  @Get()
  findAll(): Promise<Publicidad[]> {
    return this.publicidadService.findAll();
  }

  // Busca una publicidad por su identificador.
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Publicidad> {
    return this.publicidadService.findOne(id);
  }

  // Actualiza parcialmente la publicidad indicada.
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePublicidadDto,
  ): Promise<Publicidad> {
    return this.publicidadService.update(id, dto);
  }

  // Elimina la publicidad indicada y responde sin contenido.
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.publicidadService.remove(id);
  }
}
