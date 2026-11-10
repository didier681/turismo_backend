import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Favorito } from './favorito/entities/favorito.entity';
import { FavoritoService } from './favorito/favorito.service';
import { Multimedia } from './multimedia/entities/multimedia.entity';
import { MultimediaService } from './multimedia/multimedia.service';
import { Negocio } from './negocio/entities/negocio.entity';
import { NegocioService } from './negocio/negocio.service';
import { Publicidad } from './publicidad/entities/publicidad.entity';
import { PublicidadService } from './publicidad/publicidad.service';
import { Resena } from './resena/entities/resena.entity';
import { ResenaService } from './resena/resena.service';
import { CreateTarifaDto } from './tarifa/dto/create-tarifa.dto';
import { Tarifa } from './tarifa/entities/tarifa.entity';
import { TarifaService } from './tarifa/tarifa.service';
import { SitioTuristico } from './sitio-turistico/entities/sitio-turistico.entity';
import { User, UserRole } from './user/entities/user.entity';
import { Zona } from './zona/entities/zona.entity';

describe('Reglas de negocio', () => {
  const usuario = { id: 5, role: UserRole.Usuario } as User;

  it('rechaza una segunda reseña del mismo usuario para el sitio', async () => {
    const resenas = { existsBy: vi.fn().mockResolvedValue(true) };
    const service = new ResenaService(
      resenas as unknown as Repository<Resena>,
      { existsBy: vi.fn().mockResolvedValue(true) } as unknown as Repository<User>,
      {
        existsBy: vi.fn().mockResolvedValue(true),
      } as unknown as Repository<SitioTuristico>,
    );

    await expect(
      service.create(
        { idSitio: 2, calificacion: 5, comentario: 'Excelente' },
        usuario,
      ),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('rechaza coordenadas de negocio fuera de rango', async () => {
    const service = new NegocioService(
      {} as Repository<Negocio>,
      {} as Repository<SitioTuristico>,
      {} as Repository<Zona>,
    );

    await expect(
      service.create(
        { latitud: 90.01, longitud: 0 } as never,
        usuario,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rechaza una tarifa cuyo período se cruza con otra del mismo nombre', async () => {
    const queryBuilder = {
      where: vi.fn(),
      andWhere: vi.fn(),
      getOne: vi.fn().mockResolvedValue({ idTarifa: 7 }),
    };
    queryBuilder.where.mockReturnValue(queryBuilder);
    queryBuilder.andWhere.mockReturnValue(queryBuilder);
    const service = new TarifaService(
      {
        createQueryBuilder: vi.fn().mockReturnValue(
          queryBuilder as unknown as SelectQueryBuilder<Tarifa>,
        ),
      } as unknown as Repository<Tarifa>,
      {
        findOne: vi.fn().mockResolvedValue({
          idServicio: 3,
          negocio: { idUsuario: usuario.id },
        }),
      } as never,
    );
    const dto = {
      idServicio: 3,
      nombreTarifa: 'Entrada',
      precio: 10000,
      vigenciaIni: '2026-11-01',
      vigenciaFin: '2026-11-30',
    } as CreateTarifaDto;

    await expect(service.create(dto, usuario)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('impide crear publicidad para un negocio con membresía gratis', async () => {
    const service = new PublicidadService(
      {} as Repository<Publicidad>,
      {
        findOneBy: vi.fn().mockResolvedValue({
          idNegocio: 4,
          idUsuario: usuario.id,
          estadoMembresia: 'gratis',
        }),
      } as unknown as Repository<Negocio>,
      {} as Repository<SitioTuristico>,
    );

    await expect(
      service.create(
        {
          idNegocio: 4,
          tipoPlan: 'basico',
          presupuesto: 50000,
          fechaIni: '2099-01-01',
          fechaFin: '2099-01-02',
        } as never,
        usuario,
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('limita a diez registros multimedia por entidad', async () => {
    const service = new MultimediaService(
      { countBy: vi.fn().mockResolvedValue(10) } as unknown as Repository<Multimedia>,
      { existsBy: vi.fn().mockResolvedValue(true) } as unknown as Repository<SitioTuristico>,
      {} as Repository<Negocio>,
    );

    await expect(
      service.create(
        {
          tipoEntidad: 'sitio',
          idEntidad: 2,
          tipoContenido: 'imagen',
          urlContenido: 'https://ejemplo.com/imagen.jpg',
          orden: 0,
        } as never,
        { id: 1, role: UserRole.Admin } as User,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('consulta solo los favoritos pertenecientes al usuario autenticado', async () => {
    const find = vi.fn().mockResolvedValue([]);
    const service = new FavoritoService(
      { find } as unknown as Repository<Favorito>,
      {} as Repository<User>,
      {} as Repository<SitioTuristico>,
      {} as DataSource,
    );

    await service.findMios(usuario);

    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({ where: { idUsuario: usuario.id } }),
    );
  });
});
