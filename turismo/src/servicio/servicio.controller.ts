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
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { Servicio } from './entities/servicio.entity';
import { ServicioService } from './servicio.service';

@Controller('servicios')
// Expone las operaciones CRUD de los servicios ofrecidos.
export class ServicioController {
  // Inyecta el servicio que gestiona los servicios ofrecidos.
  constructor(private readonly servicioService: ServicioService) {}

  // Crea un servicio con los datos validados de la solicitud.
  @Post()
  create(@Body() dto: CreateServicioDto): Promise<Servicio> {
    return this.servicioService.create(dto);
  }

  // Devuelve todos los servicios con su negocio y tarifas.
  @Get()
  findAll(): Promise<Servicio[]> {
    return this.servicioService.findAll();
  }

  // Busca un servicio por su identificador.
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Servicio> {
    return this.servicioService.findOne(id);
  }

  // Actualiza parcialmente el servicio indicado.
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateServicioDto,
  ): Promise<Servicio> {
    return this.servicioService.update(id, dto);
  }

  // Elimina el servicio indicado y responde sin contenido.
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.servicioService.remove(id);
  }
}
