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
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
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
  @ApiConflictResponse({ description: 'El sitio ya está guardado en favoritos.' })
  @ApiNotFoundResponse({ description: 'El sitio indicado no existe.' })
  create(
    @Body() dto: CreateFavoritoDto,
    @GetUser() user: User,
  ): Promise<Favorito> {
    return this.favoritoService.create(dto, user);
  }

  @Get('mios')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar los favoritos del usuario autenticado' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Favoritos del usuario del token.',
  })
  mios(@GetUser() user: User): Promise<Favorito[]> {
    return this.favoritoService.findMios(user);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  // La lista global puede revelar patrones de actividad; se reserva a admins.
  findAll(): Promise<Favorito[]> {
    return this.favoritoService.findAll();
  }

  @Get(':idUsuario/:idSitio')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  // Solo administradores consultan favoritos ajenos por su clave compuesta.
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
