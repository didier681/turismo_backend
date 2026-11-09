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
import { CreateTarifaDto } from './dto/create-tarifa.dto';
import { UpdateTarifaDto } from './dto/update-tarifa.dto';
import { Tarifa } from './entities/tarifa.entity';
import { TarifaService } from './tarifa.service';

@Controller('tarifas')
@ApiTags('Tarifa')
// Expone las operaciones CRUD de las tarifas.
export class TarifaController {
  // Inyecta el servicio que gestiona las tarifas.
  constructor(private readonly tarifaService: TarifaService) {}

  // Crea una tarifa con los datos validados de la solicitud.
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('negocio', 'admin')
  @ApiBearerAuth()
  create(
    @Body() dto: CreateTarifaDto,
    @GetUser() user: User,
  ): Promise<Tarifa> {
    return this.tarifaService.create(dto, user);
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('negocio', 'admin')
  @ApiBearerAuth()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTarifaDto,
    @GetUser() user: User,
  ): Promise<Tarifa> {
    return this.tarifaService.update(id, dto, user);
  }

  // Elimina la tarifa indicada y responde sin contenido.
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('negocio', 'admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.tarifaService.remove(id, user);
  }
}
