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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CategoriaSitio } from './entities/categoria-sitio.entity';
import { CreateCategoriaSitioDto } from './dto/create-categoria-sitio.dto';
import { UpdateCategoriaSitioDto } from './dto/update-categoria-sitio.dto';
import { CategoriaSitioService } from './categoria-sitio.service';

@Controller('categorias-sitio')
@ApiTags('CategoriaSitio')
// Expone el CRUD de las categorías de sitios.
export class CategoriaSitioController {
  constructor(private readonly categoriaService: CategoriaSitioService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  create(@Body() dto: CreateCategoriaSitioDto): Promise<CategoriaSitio> {
    return this.categoriaService.create(dto);
  }

  @Get()
  findAll(): Promise<CategoriaSitio[]> {
    return this.categoriaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<CategoriaSitio> {
    return this.categoriaService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoriaSitioDto,
  ): Promise<CategoriaSitio> {
    return this.categoriaService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoriaService.remove(id);
  }
}
