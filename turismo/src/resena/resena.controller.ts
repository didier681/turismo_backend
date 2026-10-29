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
import { CreateResenaDto } from './dto/create-resena.dto';
import { UpdateResenaDto } from './dto/update-resena.dto';
import { Resena } from './entities/resena.entity';
import { ResenaService } from './resena.service';

@Controller('resenas')
// Expone las operaciones HTTP para administrar reseñas.
export class ResenaController {
  constructor(private readonly resenaService: ResenaService) {}

  @Post()
  create(@Body() dto: CreateResenaDto): Promise<Resena> {
    return this.resenaService.create(dto);
  }

  @Get()
  findAll(): Promise<Resena[]> {
    return this.resenaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Resena> {
    return this.resenaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateResenaDto,
  ): Promise<Resena> {
    return this.resenaService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.resenaService.remove(id);
  }
}
