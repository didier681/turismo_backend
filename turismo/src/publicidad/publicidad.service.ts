import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import {
  EstadoMembresia,
  Negocio,
} from '../negocio/entities/negocio.entity';
import { SitioTuristico } from '../sitio-turistico/entities/sitio-turistico.entity';
import { CreatePublicidadDto } from './dto/create-publicidad.dto';
import { UpdatePublicidadDto } from './dto/update-publicidad.dto';
import {
  EstadoPublicidad,
  Publicidad,
  TipoPlanPublicidad,
} from './entities/publicidad.entity';
import { User, UserRole } from '../user/entities/user.entity';

@Injectable()
// Gestiona publicidades y valida sus referencias y período de vigencia.
export class PublicidadService {
  // Inyecta los repositorios de campaña, negocio y sitio turístico.
  constructor(
    @InjectRepository(Publicidad)
    private readonly publicidadRepository: Repository<Publicidad>,
    @InjectRepository(Negocio)
    private readonly negocioRepository: Repository<Negocio>,
    @InjectRepository(SitioTuristico)
    private readonly sitioRepository: Repository<SitioTuristico>,
  ) {}

  // Valida las entidades relacionadas y las fechas antes de crear la campaña.
  async create(dto: CreatePublicidadDto, user: User): Promise<Publicidad> {
    const negocio = await this.validateReferences(
      dto.idNegocio,
      dto.idSitioAsociado,
      user,
    );
    this.validateMembresia(negocio);
    this.validateFechas(dto.fechaIni, dto.fechaFin);
    this.validateFechaInicial(dto.fechaIni);
    this.validatePresupuesto(dto.tipoPlan, dto.presupuesto);
    return await this.publicidadRepository.save(
      this.publicidadRepository.create({
        ...dto,
        presupuesto: String(dto.presupuesto),
        idSitioAsociado: dto.idSitioAsociado ?? null,
      }),
    );
  }

  // Lista publicidades incluyendo el negocio y el sitio opcional asociado.
  async findAll(): Promise<Publicidad[]> {
    return await this.publicidadRepository.find({
      relations: { negocio: true, sitioAsociado: true },
    });
  }

  // Lista campañas activas cuya vigencia incluye la fecha de hoy.
  async findActivas(): Promise<Publicidad[]> {
    const hoy = fechaLocalActual();
    return await this.publicidadRepository.find({
      where: {
        estado: EstadoPublicidad.Activo,
        fechaIni: LessThanOrEqual(hoy),
        fechaFin: MoreThanOrEqual(hoy),
      },
      relations: { negocio: true, sitioAsociado: true },
      order: { fechaIni: 'ASC' },
    });
  }

  // Busca una publicidad por su identificador con sus relaciones.
  async findOne(id: number): Promise<Publicidad> {
    const publicidad = await this.publicidadRepository.findOne({
      where: { idPublicidad: id },
      relations: { negocio: true, sitioAsociado: true },
    });
    if (!publicidad) {
      throw new NotFoundException(`Publicidad con ID ${id} no encontrada`);
    }
    return publicidad;
  }

  // Actualiza la campaña validando referencias y fechas resultantes.
  async update(
    id: number,
    dto: UpdatePublicidadDto,
    user: User,
  ): Promise<Publicidad> {
    const publicidad = await this.publicidadRepository.findOneBy({
      idPublicidad: id,
    });
    if (!publicidad) {
      throw new NotFoundException(`Publicidad con ID ${id} no encontrada`);
    }
    await this.validateReferences(
      publicidad.idNegocio,
      publicidad.idSitioAsociado,
      user,
    );

    const idNegocio = dto.idNegocio ?? publicidad.idNegocio;
    const idSitioAsociado =
      dto.idSitioAsociado === undefined
        ? publicidad.idSitioAsociado
        : dto.idSitioAsociado;
    const fechaIni = dto.fechaIni ?? publicidad.fechaIni;
    const fechaFin = dto.fechaFin ?? publicidad.fechaFin;

    // Vuelve a comprobar la membresía también al editar una campaña existente.
    const negocio = await this.validateReferences(
      idNegocio,
      idSitioAsociado,
      user,
    );
    this.validateMembresia(negocio);
    this.validateFechas(fechaIni, fechaFin);
    this.validateFechaInicial(fechaIni);
    this.validatePresupuesto(
      dto.tipoPlan ?? publicidad.tipoPlan,
      dto.presupuesto === undefined
        ? Number(publicidad.presupuesto)
        : dto.presupuesto,
    );

    this.publicidadRepository.merge(publicidad, {
      ...dto,
      presupuesto:
        dto.presupuesto === undefined ? undefined : String(dto.presupuesto),
      idSitioAsociado:
        dto.idSitioAsociado === undefined ? undefined : dto.idSitioAsociado,
    });
    await this.publicidadRepository.save(publicidad);
    return await this.findOne(id);
  }

  // Elimina la publicidad indicada.
  async remove(id: number, user: User): Promise<void> {
    const publicidad = await this.publicidadRepository.findOneBy({
      idPublicidad: id,
    });
    if (!publicidad) {
      throw new NotFoundException(`Publicidad con ID ${id} no encontrada`);
    }
    await this.validateReferences(
      publicidad.idNegocio,
      publicidad.idSitioAsociado,
      user,
    );
    await this.publicidadRepository.remove(publicidad);
  }

  // Confirma que el negocio obligatorio y el sitio opcional existan.
  private async validateReferences(
    idNegocio: number,
    idSitioAsociado: number | null | undefined,
    user: User,
  ): Promise<Negocio> {
    const negocio = await this.negocioRepository.findOneBy({ idNegocio });
    if (!negocio) {
      throw new NotFoundException(`Negocio con ID ${idNegocio} no encontrado`);
    }
    if (user.role !== UserRole.Admin && negocio.idUsuario !== user.id) {
      throw new ForbiddenException('No eres propietario de este negocio');
    }
    if (idSitioAsociado !== null && idSitioAsociado !== undefined) {
      const sitioExists = await this.sitioRepository.existsBy({
        idSitio: idSitioAsociado,
      });
      if (!sitioExists) {
        throw new NotFoundException(
          `Sitio turístico con ID ${idSitioAsociado} no encontrado`,
        );
      }
    }
    return negocio;
  }

  // Requiere que ambas fechas sean válidas y que el cierre sea posterior.
  private validateFechas(fechaIni: string, fechaFin: string): void {
    const inicio = Date.parse(fechaIni);
    const fin = Date.parse(fechaFin);
    if (!Number.isFinite(inicio) || !Number.isFinite(fin) || fin <= inicio) {
      throw new BadRequestException(
        'fechaFin debe ser una fecha válida posterior a fechaIni',
      );
    }
  }

  private validateFechaInicial(fechaIni: string): void {
    if (fechaIni < fechaLocalActual()) {
      throw new BadRequestException(
        'fechaIni no puede ser anterior a la fecha de hoy',
      );
    }
  }

  private validatePresupuesto(
    tipoPlan: TipoPlanPublicidad,
    presupuesto: number,
  ): void {
    const minimo =
      tipoPlan === TipoPlanPublicidad.Basico
        ? 50000
        : tipoPlan === TipoPlanPublicidad.Premium
          ? 150000
          : 0;
    if (!Number.isFinite(presupuesto) || presupuesto < minimo) {
      throw new BadRequestException(
        `El presupuesto mínimo para el plan ${tipoPlan} es de $${minimo.toLocaleString('es-CO')}`,
      );
    }
  }

  private validateMembresia(negocio: Negocio): void {
    if (negocio.estadoMembresia === EstadoMembresia.Gratis) {
      throw new ForbiddenException(
        'Un negocio con membresía gratis no puede crear publicidad',
      );
    }
  }
}

function fechaLocalActual(): string {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}
