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
import { CreateCategoriaNegocioDto } from './dto/create-categoria-negocio.dto';
import { UpdateCategoriaNegocioDto } from './dto/update-categoria-negocio.dto';
import { CategoriaNegocio } from './entities/categoria-negocio.entity';
import { CategoriaNegocioService } from './categoria-negocio.service';

@Controller('categorias-negocio')
@ApiTags('CategoriaNegocio')
// Expone las operaciones CRUD de las categorías de negocio.
export class CategoriaNegocioController {
  // Inyecta el servicio que ejecuta las operaciones de categorías.
  constructor(private readonly categoriaService: CategoriaNegocioService) {}

  // Crea una categoría con los datos validados del cuerpo de la solicitud.
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  create(
    @Body() dto: CreateCategoriaNegocioDto,
  ): Promise<CategoriaNegocio> {
    return this.categoriaService.create(dto);
  }

  // Devuelve todas las categorías registradas.
  @Get()
  findAll(): Promise<CategoriaNegocio[]> {
    return this.categoriaService.findAll();
  }

  // Busca una categoría por su identificador.
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<CategoriaNegocio> {
    return this.categoriaService.findOne(id);
  }

  // Actualiza parcialmente la categoría indicada.
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoriaNegocioDto,
  ): Promise<CategoriaNegocio> {
    return this.categoriaService.update(id, dto);
  }

  // Elimina la categoría indicada y responde sin contenido.
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoriaService.remove(id);
  }
}
