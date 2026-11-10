import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  FindOperator,
  In,
  QueryFailedError,
  Repository,
} from 'typeorm';
import {
  EstadoRevision,
  SitioTuristico,
} from './entities/sitio-turistico.entity';
import { Zona } from '../zona/entities/zona.entity';
import { CreateSitioTuristicoDto } from './dto/create-sitio-turistico.dto';
import { UpdateSitioTuristicoDto } from './dto/update-sitio-turistico.dto';
import { GestorZona } from '../gestor-zona/entities/gestor-zona.entity';
import { User, UserRole } from '../user/entities/user.entity';
import { SugerirSitioTuristicoDto } from './dto/sugerir-sitio-turistico.dto';
import { RechazarSitioTuristicoDto } from './dto/rechazar-sitio-turistico.dto';
import { ConfirmacionSitio } from './entities/confirmacion-sitio.entity';
import { Resena } from '../resena/entities/resena.entity';

@Injectable()
// Gestiona sitios turísticos, sugerencias de la comunidad y su moderación.
export class SitioTuristicoService {
  constructor(
    @InjectRepository(SitioTuristico)
    private readonly sitioRepository: Repository<SitioTuristico>,
    @InjectRepository(Zona)
    private readonly zonaRepository: Repository<Zona>,
    @InjectRepository(GestorZona)
    private readonly gestorZonaRepository: Repository<GestorZona>,
    @InjectRepository(ConfirmacionSitio)
    private readonly confirmacionRepository: Repository<ConfirmacionSitio>,
    private readonly dataSource: DataSource,
  ) {}

  // Comprueba la zona asociada antes de guardar el nuevo sitio.
  async create(
    dto: CreateSitioTuristicoDto,
    user: User,
  ): Promise<SitioTuristico> {
    const zoneExists = await this.zonaRepository.existsBy({
      idZona: dto.idZona,
    });
    if (!zoneExists) {
      throw new NotFoundException(`Zona con ID ${dto.idZona} no encontrada`);
    }
    await this.assertCanManageZone(dto.idZona, user);
    return await this.sitioRepository.save(this.sitioRepository.create(dto));
  }

  // Registra una sugerencia pendiente después de validar zona, cuota y duplicados.
  async suggest(
    dto: SugerirSitioTuristicoDto,
    user: User,
  ): Promise<SitioTuristico> {
    const zoneExists = await this.zonaRepository.existsBy({
      idZona: dto.idZona,
    });
    if (!zoneExists) {
      throw new NotFoundException(`Zona con ID ${dto.idZona} no encontrada`);
    }

    const inicioDia = new Date();
    inicioDia.setHours(0, 0, 0, 0);
    const inicioDiaSiguiente = new Date(inicioDia);
    inicioDiaSiguiente.setDate(inicioDiaSiguiente.getDate() + 1);
    const sugerenciasHoy = await this.sitioRepository
      .createQueryBuilder('sitio')
      .where('sitio.idUsuarioSugiere = :idUsuario', { idUsuario: user.id })
      .andWhere('sitio.fechaCreacion >= :inicioDia', { inicioDia })
      .andWhere('sitio.fechaCreacion < :inicioDiaSiguiente', {
        inicioDiaSiguiente,
      })
      .getCount();
    if (sugerenciasHoy >= 3) {
      throw new BadRequestException(
        'Has alcanzado el límite de 3 sugerencias de sitios turísticos por día',
      );
    }

    const sitiosCercanos = await this.sitioRepository
      .createQueryBuilder('sitio')
      .where('sitio.estadoRevision IN (:...estados)', {
        estados: [EstadoRevision.Pendiente, EstadoRevision.Aprobado],
      })
      .andWhere(
        '2 * 6371000 * ASIN(SQRT(POWER(SIN(RADIANS(sitio.latitud - :latitud) / 2), 2) + COS(RADIANS(:latitud)) * COS(RADIANS(sitio.latitud)) * POWER(SIN(RADIANS(sitio.longitud - :longitud) / 2), 2))) < :distancia',
        {
          latitud: Number(dto.latitud),
          longitud: Number(dto.longitud),
          distancia: 200,
        },
      )
      .getMany();
    const duplicado = sitiosCercanos.find((sitio) =>
      nombresParecidos(sitio.nombre, dto.nombre),
    );
    if (duplicado) {
      throw new ConflictException({
        message: 'Ya existe un sitio con un nombre parecido a menos de 200 metros',
        sitio: duplicado,
      });
    }

    return await this.sitioRepository.save(
      this.sitioRepository.create({
        ...dto,
        estadoRevision: EstadoRevision.Pendiente,
        idUsuarioSugiere: user.id,
        motivoRechazo: null,
        confirmaciones: 0,
      }),
    );
  }

  // Incluye la zona y las categorías para entregar el contexto del sitio.
  // Los endpoints públicos solo exponen sitios aprobados.
  async findAll(): Promise<SitioTuristico[]> {
    return await this.sitioRepository.find({
      where: { estadoRevision: EstadoRevision.Aprobado },
      relations: { zona: true, categorias: { categoria: true } },
    });
  }

  // Devuelve un sitio aprobado con sus relaciones o responde con 404.
  async findOne(id: number): Promise<SitioTuristico> {
    const sitio = await this.sitioRepository.findOne({
      where: { idSitio: id, estadoRevision: EstadoRevision.Aprobado },
      relations: { zona: true, categorias: { categoria: true } },
    });
    if (!sitio) {
      throw new NotFoundException(`Sitio turístico con ID ${id} no encontrado`);
    }
    return sitio;
  }

  // Calcula el promedio y total de reseñas de un sitio público aprobado.
  async findCalificacion(
    id: number,
  ): Promise<{ promedio: number; total: number }> {
    await this.findOne(id);
    const resultado = await this.dataSource
      .getRepository(Resena)
      .createQueryBuilder('resena')
      .select('AVG(resena.calificacion)', 'promedio')
      .addSelect('COUNT(resena.idResena)', 'total')
      .where('resena.idSitio = :idSitio', { idSitio: id })
      .getRawOne<{ promedio: string | null; total: string }>();

    if (!resultado) {
      throw new Error('No se pudo calcular la calificación del sitio');
    }
    return {
      promedio:
        resultado.promedio === null ? 0 : Number(resultado.promedio),
      total: Number(resultado.total),
    };
  }

  // Lista pendientes por zona asignada al gestor o todas para el administrador.
  async findPending(user: User): Promise<SitioTuristico[]> {
    const where: {
      estadoRevision: EstadoRevision;
      idZona?: FindOperator<number>;
    } = { estadoRevision: EstadoRevision.Pendiente };

    if (user.role !== UserRole.Admin) {
      const asignaciones = await this.gestorZonaRepository.find({
        where: { idUsuario: user.id },
        select: { idZona: true },
      });
      const zonas = asignaciones.map(({ idZona }) => idZona);
      if (zonas.length === 0) {
        return [];
      }
      where.idZona = In(zonas);
    }

    return await this.sitioRepository.find({
      where,
      relations: { zona: true, categorias: { categoria: true } },
      order: { confirmaciones: 'DESC' },
    });
  }

  // Aprueba una sugerencia solo si el usuario administra la zona del sitio.
  async approve(id: number, user: User): Promise<SitioTuristico> {
    const sitio = await this.findForModeration(id);
    await this.assertCanManageZone(sitio.idZona, user);
    sitio.estadoRevision = EstadoRevision.Aprobado;
    sitio.motivoRechazo = null;
    return await this.sitioRepository.save(sitio);
  }

  // Rechaza una sugerencia y guarda el motivo obligatorio de la decisión.
  async reject(
    id: number,
    dto: RechazarSitioTuristicoDto,
    user: User,
  ): Promise<SitioTuristico> {
    const sitio = await this.findForModeration(id);
    await this.assertCanManageZone(sitio.idZona, user);
    sitio.estadoRevision = EstadoRevision.Rechazado;
    sitio.motivoRechazo = dto.motivoRechazo;
    return await this.sitioRepository.save(sitio);
  }

  // Registra una única confirmación por usuario y actualiza el contador en transacción.
  async confirm(id: number, user: User): Promise<SitioTuristico> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const sitioRepository = manager.getRepository(SitioTuristico);
        const confirmacionRepository = manager.getRepository(ConfirmacionSitio);
        const sitio = await sitioRepository.findOneBy({ idSitio: id });
        if (!sitio) {
          throw new NotFoundException(
            `Sitio turístico con ID ${id} no encontrado`,
          );
        }
        if (sitio.idUsuarioSugiere === user.id) {
          throw new BadRequestException(
            'No puedes confirmar un sitio que tú mismo sugeriste',
          );
        }
        if (
          await confirmacionRepository.existsBy({
            idUsuario: user.id,
            idSitio: id,
          })
        ) {
          throw new ConflictException('Ya confirmaste este sitio');
        }

        await confirmacionRepository.insert({
          idUsuario: user.id,
          idSitio: id,
        });
        await sitioRepository.increment({ idSitio: id }, 'confirmaciones', 1);
        return await sitioRepository.findOneByOrFail({ idSitio: id });
      });
    } catch (error) {
      if (esDuplicadoDeBaseDeDatos(error)) {
        throw new ConflictException('Ya confirmaste este sitio');
      }
      throw error;
    }
  }

  // Valida la zona si cambia y guarda los campos recibidos.
  async update(
    id: number,
    dto: UpdateSitioTuristicoDto,
    user: User,
  ): Promise<SitioTuristico> {
    const sitio = await this.sitioRepository.findOneBy({ idSitio: id });
    if (!sitio) {
      throw new NotFoundException(`Sitio turístico con ID ${id} no encontrado`);
    }
    if (dto.idZona !== undefined) {
      const zoneExists = await this.zonaRepository.existsBy({
        idZona: dto.idZona,
      });
      if (!zoneExists) {
        throw new NotFoundException(`Zona con ID ${dto.idZona} no encontrada`);
      }
    }
    await this.assertCanManageZone(sitio.idZona, user);
    await this.assertCanManageZone(dto.idZona ?? sitio.idZona, user);
    this.sitioRepository.merge(sitio, dto);
    return await this.sitioRepository.save(sitio);
  }

  // Elimina el sitio indicado o responde con 404 si no existe.
  async remove(id: number, user: User): Promise<void> {
    const sitio = await this.sitioRepository.findOneBy({ idSitio: id });
    if (!sitio) {
      throw new NotFoundException(`Sitio turístico con ID ${id} no encontrado`);
    }
    await this.assertCanManageZone(sitio.idZona, user);
    await this.sitioRepository.remove(sitio);
  }

  private async findForModeration(id: number): Promise<SitioTuristico> {
    const sitio = await this.sitioRepository.findOneBy({ idSitio: id });
    if (!sitio) {
      throw new NotFoundException(`Sitio turístico con ID ${id} no encontrado`);
    }
    return sitio;
  }

  private async assertCanManageZone(idZona: number, user: User): Promise<void> {
    if (user.role === UserRole.Admin) {
      return;
    }
    const assigned = await this.gestorZonaRepository.existsBy({
      idUsuario: user.id,
      idZona,
    });
    if (!assigned) {
      throw new ForbiddenException('No tienes permisos sobre esta zona');
    }
  }
}

function nombresParecidos(nombreA: string, nombreB: string): boolean {
  const normalizar = (nombre: string): string =>
    nombre
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
  const a = normalizar(nombreA);
  const b = normalizar(nombreB);
  if (!a || !b) {
    return false;
  }

  if (a.includes(b) || b.includes(a)) {
    return Math.min(a.length, b.length) / Math.max(a.length, b.length) >= 0.6;
  }

  let anterior = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let fila = 1; fila <= a.length; fila += 1) {
    const actual = [fila];
    for (let columna = 1; columna <= b.length; columna += 1) {
      actual[columna] = Math.min(
        actual[columna - 1] + 1,
        anterior[columna] + 1,
        anterior[columna - 1] + (a[fila - 1] === b[columna - 1] ? 0 : 1),
      );
    }
    anterior = actual;
  }
  return anterior[b.length] / Math.max(a.length, b.length) <= 0.2;
}

function esDuplicadoDeBaseDeDatos(error: unknown): boolean {
  if (!(error instanceof QueryFailedError)) {
    return false;
  }
  const driverError = error.driverError;
  return (
    typeof driverError === 'object' &&
    driverError !== null &&
    'code' in driverError &&
    driverError.code === 'ER_DUP_ENTRY'
  );
}
