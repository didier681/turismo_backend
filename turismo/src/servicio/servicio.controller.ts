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
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { User } from '../user/entities/user.entity';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { Servicio } from './entities/servicio.entity';
import { ServicioService } from './servicio.service';

@Controller('servicios')
@ApiTags('Servicio')
// Expone las operaciones CRUD de los servicios ofrecidos.
export class ServicioController {
  // Inyecta el servicio que gestiona los servicios ofrecidos.
  constructor(private readonly servicioService: ServicioService) {}

  // Crea un servicio con los datos validados de la solicitud.
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('negocio', 'admin')
  @ApiBearerAuth()
  create(
    @Body() dto: CreateServicioDto,
    @GetUser() user: User,
  ): Promise<Servicio> {
    return this.servicioService.create(dto, user);
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('negocio', 'admin')
  @ApiBearerAuth()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateServicioDto,
    @GetUser() user: User,
  ): Promise<Servicio> {
    return this.servicioService.update(id, dto, user);
  }

  // Elimina el servicio indicado y responde sin contenido.
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('negocio', 'admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.servicioService.remove(id, user);
  }
}
