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
  constructor(private readonly negocioService: NegocioService) {}

  @Post()
  create(@Body() dto: CreateNegocioDto): Promise<Negocio> {
    return this.negocioService.create(dto);
  }

  @Get()
  findAll(): Promise<Negocio[]> {
    return this.negocioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Negocio> {
    return this.negocioService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNegocioDto,
  ): Promise<Negocio> {
    return this.negocioService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.negocioService.remove(id);
  }
}
