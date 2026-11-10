import { BadRequestException, ConflictException } from '@nestjs/common';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { GestorZona } from '../gestor-zona/entities/gestor-zona.entity';
import { User, UserRole } from '../user/entities/user.entity';
import { Zona } from '../zona/entities/zona.entity';
import { SugerirSitioTuristicoDto } from './dto/sugerir-sitio-turistico.dto';
import { ConfirmacionSitio } from './entities/confirmacion-sitio.entity';
import {
  EstadoRevision,
  SitioTuristico,
} from './entities/sitio-turistico.entity';
import { SitioTuristicoService } from './sitio-turistico.service';

describe('SitioTuristicoService community suggestions', () => {
  const sitioRepository = {
    create: vi.fn((values: Partial<SitioTuristico>) => values),
    save: vi.fn(async (sitio: Partial<SitioTuristico>) => sitio),
    createQueryBuilder: vi.fn(),
  };
  const zonaRepository = { existsBy: vi.fn() };
  const gestorZonaRepository = { find: vi.fn(), existsBy: vi.fn() };
  const confirmacionRepository = { existsBy: vi.fn() };
  const dataSource = { transaction: vi.fn() };
  const queryBuilder = {
    where: vi.fn(),
    andWhere: vi.fn(),
    getCount: vi.fn(),
    getMany: vi.fn(),
  };
  let service: SitioTuristicoService;
  const usuario = { id: 8, role: UserRole.Usuario } as User;
  const dto: SugerirSitioTuristicoDto = {
    idZona: 2,
    nombre: 'Parque Central',
    descripcion: 'Un parque junto al río.',
    latitud: '8.7500000',
    longitud: '-75.8833000',
    horarioApertura: '06:00',
    horarioCierre: '22:00',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    queryBuilder.where.mockReturnThis();
    queryBuilder.andWhere.mockReturnThis();
    queryBuilder.getCount.mockResolvedValue(0);
    queryBuilder.getMany.mockResolvedValue([]);
    sitioRepository.createQueryBuilder.mockReturnValue(
      queryBuilder as unknown as SelectQueryBuilder<SitioTuristico>,
    );
    zonaRepository.existsBy.mockResolvedValue(true);
    sitioRepository.save.mockImplementation(
      async (sitio: Partial<SitioTuristico>) => sitio,
    );
    service = new SitioTuristicoService(
      sitioRepository as unknown as Repository<SitioTuristico>,
      zonaRepository as unknown as Repository<Zona>,
      gestorZonaRepository as unknown as Repository<GestorZona>,
      confirmacionRepository as unknown as Repository<ConfirmacionSitio>,
      dataSource as unknown as DataSource,
    );
  });

  it('creates a pending suggestion tied to the authenticated user', async () => {
    const result = await service.suggest(dto, usuario);

    expect(result).toMatchObject({
      ...dto,
      estadoRevision: EstadoRevision.Pendiente,
      idUsuarioSugiere: usuario.id,
      motivoRechazo: null,
      confirmaciones: 0,
    });
    expect(queryBuilder.andWhere).toHaveBeenCalledWith(
      expect.stringContaining('ASIN(SQRT'),
      expect.objectContaining({ distancia: 200 }),
    );
  });

  it('rejects suggestions after the daily limit', async () => {
    queryBuilder.getCount.mockResolvedValue(3);

    await expect(service.suggest(dto, usuario)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(queryBuilder.getMany).not.toHaveBeenCalled();
  });

  it('returns a conflict with a nearby similarly named site', async () => {
    queryBuilder.getMany.mockResolvedValue([
      { idSitio: 12, nombre: 'Parque Central', idZona: 2 },
    ]);

    try {
      await service.suggest(dto, usuario);
      throw new Error('Se esperaba un conflicto por sitio duplicado');
    } catch (error) {
      expect(error).toBeInstanceOf(ConflictException);
      expect((error as ConflictException).getResponse()).toMatchObject({
        sitio: { idSitio: 12, nombre: 'Parque Central' },
      });
    }

    expect(sitioRepository.save).not.toHaveBeenCalled();
  });

  it('returns no pending sites when a manager has no assigned zones', async () => {
    gestorZonaRepository.find.mockResolvedValue([]);

    await expect(
      service.findPending({ id: 4, role: UserRole.Gestor } as User),
    ).resolves.toEqual([]);
    expect(sitioRepository.createQueryBuilder).not.toHaveBeenCalled();
  });
});
