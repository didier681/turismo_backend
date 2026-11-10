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
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { SitioTuristico } from './entities/sitio-turistico.entity';
import { CreateSitioTuristicoDto } from './dto/create-sitio-turistico.dto';
import { UpdateSitioTuristicoDto } from './dto/update-sitio-turistico.dto';
import { SugerirSitioTuristicoDto } from './dto/sugerir-sitio-turistico.dto';
import { RechazarSitioTuristicoDto } from './dto/rechazar-sitio-turistico.dto';
import { SitioTuristicoService } from './sitio-turistico.service';

@Controller('sitios-turisticos')
@ApiTags('SitioTuristico')
// Expone el CRUD de sitios turísticos mediante la API REST.
export class SitioTuristicoController {
  constructor(private readonly sitioService: SitioTuristicoService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'gestor')
  @ApiBearerAuth()
  create(
    @Body() dto: CreateSitioTuristicoDto,
    @GetUser() user: User,
  ): Promise<SitioTuristico> {
    return this.sitioService.create(dto, user);
  }

  @Post('sugerir')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sugerir un sitio turístico a la comunidad' })
  @ApiCreatedResponse({ description: 'Sugerencia creada como pendiente.' })
  @ApiConflictResponse({
    description: 'Ya existe un sitio parecido a menos de 200 metros.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Se alcanzó el límite diario de tres sugerencias.',
  })
  sugerir(
    @Body() dto: SugerirSitioTuristicoDto,
    @GetUser() user: User,
  ): Promise<SitioTuristico> {
    return this.sitioService.suggest(dto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar sitios turísticos aprobados' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Sitios aprobados.' })
  findAll(): Promise<SitioTuristico[]> {
    return this.sitioService.findAll();
  }

  @Get('pendientes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'gestor')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar sugerencias pendientes que puede moderar el usuario',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sitios pendientes ordenados por número de confirmaciones.',
  })
  pendientes(@GetUser() user: User): Promise<SitioTuristico[]> {
    return this.sitioService.findPending(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar un sitio turístico aprobado' })
  @ApiNotFoundResponse({ description: 'Sitio aprobado no encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<SitioTuristico> {
    return this.sitioService.findOne(id);
  }

  @Patch(':id/aprobar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'gestor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aprobar una sugerencia de sitio' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Sitio aprobado.' })
  aprobar(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<SitioTuristico> {
    return this.sitioService.approve(id, user);
  }

  @Patch(':id/rechazar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'gestor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rechazar una sugerencia indicando el motivo' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Sitio rechazado.' })
  rechazar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RechazarSitioTuristicoDto,
    @GetUser() user: User,
  ): Promise<SitioTuristico> {
    return this.sitioService.reject(id, dto, user);
  }

  @Post(':id/confirmar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirmar un sitio turístico' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Confirmación registrada y contador actualizado.',
  })
  @ApiConflictResponse({ description: 'El usuario ya confirmó este sitio.' })
  confirmar(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<SitioTuristico> {
    return this.sitioService.confirm(id, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'gestor')
  @ApiBearerAuth()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSitioTuristicoDto,
    @GetUser() user: User,
  ): Promise<SitioTuristico> {
    return this.sitioService.update(id, dto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'gestor')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.sitioService.remove(id, user);
  }
}
