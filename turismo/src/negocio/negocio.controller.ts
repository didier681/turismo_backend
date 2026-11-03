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
import { CreateNegocioDto } from './dto/create-negocio.dto';
import { UpdateNegocioDto } from './dto/update-negocio.dto';
import { Negocio } from './entities/negocio.entity';
import { NegocioService } from './negocio.service';

@Controller('negocios')
// Expone las operaciones CRUD de los negocios turísticos.
export class NegocioController {
  // Inyecta el servicio que gestiona los negocios.
  constructor(private readonly negocioService: NegocioService) {}

  // Crea un negocio con los datos validados de la solicitud.
  @Post()
  create(@Body() dto: CreateNegocioDto): Promise<Negocio> {
    return this.negocioService.create(dto);
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNegocioDto,
  ): Promise<Negocio> {
    return this.negocioService.update(id, dto);
  }

  // Elimina el negocio indicado y responde sin contenido.
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.negocioService.remove(id);
  }
}
