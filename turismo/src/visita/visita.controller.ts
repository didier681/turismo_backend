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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { User } from '../user/entities/user.entity';
import { CreateVisitaDto } from './dto/create-visita.dto';
import { UpdateVisitaDto } from './dto/update-visita.dto';
import { Visita } from './entities/visita.entity';
import { VisitaService } from './visita.service';

@Controller('visitas')
@ApiTags('Visita')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
// Expone los endpoints para registrar y consultar visitas.
export class VisitaController {
  constructor(private readonly visitaService: VisitaService) {}

  @Post()
  create(
    @Body() dto: CreateVisitaDto,
    @GetUser() user: User,
  ): Promise<Visita> {
    return this.visitaService.create(dto, user);
  }

  @Get('mias')
  // La consulta del historial personal se limita al usuario autenticado.
  @ApiBearerAuth()
  findMias(@GetUser() user: User): Promise<Visita[]> {
    return this.visitaService.findMias(user);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  // Solo administradores pueden consultar el historial global.
  findAll(): Promise<Visita[]> {
    return this.visitaService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  // Evita que otros roles consulten visitas ajenas por identificador.
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Visita> {
    return this.visitaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVisitaDto,
    @GetUser() user: User,
  ): Promise<Visita> {
    return this.visitaService.update(id, dto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.visitaService.remove(id, user);
  }
}
