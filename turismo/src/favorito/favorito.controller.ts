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
import { User } from '../user/entities/user.entity';
import { CreateFavoritoDto } from './dto/create-favorito.dto';
import { UpdateFavoritoDto } from './dto/update-favorito.dto';
import { Favorito } from './entities/favorito.entity';
import { FavoritoService } from './favorito.service';

@Controller('favoritos')
@ApiTags('Favorito')
// Expone operaciones de favoritos identificados por usuario y sitio.
export class FavoritoController {
  constructor(private readonly favoritoService: FavoritoService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(
    @Body() dto: CreateFavoritoDto,
    @GetUser() user: User,
  ): Promise<Favorito> {
    return this.favoritoService.create(dto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll(): Promise<Favorito[]> {
    return this.favoritoService.findAll();
  }

  @Get(':idUsuario/:idSitio')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(
    @Param('idUsuario', ParseIntPipe) idUsuario: number,
    @Param('idSitio', ParseIntPipe) idSitio: number,
  ): Promise<Favorito> {
    return this.favoritoService.findOne(idUsuario, idSitio);
  }

  @Patch(':idSitio')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(
    @Param('idSitio', ParseIntPipe) idSitio: number,
    @Body() dto: UpdateFavoritoDto,
    @GetUser() user: User,
  ): Promise<Favorito> {
    return this.favoritoService.update(idSitio, dto, user);
  }

  @Delete(':idSitio')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('idSitio', ParseIntPipe) idSitio: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.favoritoService.remove(idSitio, user);
  }
}
