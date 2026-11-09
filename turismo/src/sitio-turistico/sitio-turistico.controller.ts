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
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { SitioTuristico } from './entities/sitio-turistico.entity';
import { CreateSitioTuristicoDto } from './dto/create-sitio-turistico.dto';
import { UpdateSitioTuristicoDto } from './dto/update-sitio-turistico.dto';
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

  @Get()
  findAll(): Promise<SitioTuristico[]> {
    return this.sitioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<SitioTuristico> {
    return this.sitioService.findOne(id);
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
