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
import { CreateTarifaDto } from './dto/create-tarifa.dto';
import { UpdateTarifaDto } from './dto/update-tarifa.dto';
import { Tarifa } from './entities/tarifa.entity';
import { TarifaService } from './tarifa.service';

@Controller('tarifas')
// Expone las operaciones CRUD de las tarifas.
export class TarifaController {
  // Inyecta el servicio que gestiona las tarifas.
  constructor(private readonly tarifaService: TarifaService) {}

  // Crea una tarifa con los datos validados de la solicitud.
  @Post()
  create(@Body() dto: CreateTarifaDto): Promise<Tarifa> {
    return this.tarifaService.create(dto);
  }

  // Devuelve todas las tarifas con su servicio asociado.
  @Get()
  findAll(): Promise<Tarifa[]> {
    return this.tarifaService.findAll();
  }

  // Busca una tarifa por su identificador.
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Tarifa> {
    return this.tarifaService.findOne(id);
  }

  // Actualiza parcialmente la tarifa indicada.
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTarifaDto,
  ): Promise<Tarifa> {
    return this.tarifaService.update(id, dto);
  }

  // Elimina la tarifa indicada y responde sin contenido.
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tarifaService.remove(id);
  }
}
