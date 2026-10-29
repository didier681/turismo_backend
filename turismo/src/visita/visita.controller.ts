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
import { CreateVisitaDto } from './dto/create-visita.dto';
import { UpdateVisitaDto } from './dto/update-visita.dto';
import { Visita } from './entities/visita.entity';
import { VisitaService } from './visita.service';

@Controller('visitas')
// Expone los endpoints para registrar y consultar visitas.
export class VisitaController {
  constructor(private readonly visitaService: VisitaService) {}

  @Post()
  create(@Body() dto: CreateVisitaDto): Promise<Visita> {
    return this.visitaService.create(dto);
  }

  @Get()
  findAll(): Promise<Visita[]> {
    return this.visitaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Visita> {
    return this.visitaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVisitaDto,
  ): Promise<Visita> {
    return this.visitaService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.visitaService.remove(id);
  }
}
