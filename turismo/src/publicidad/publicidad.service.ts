import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Negocio } from '../negocio/entities/negocio.entity';
import { SitioTuristico } from '../sitio-turistico/entities/sitio-turistico.entity';
import { CreatePublicidadDto } from './dto/create-publicidad.dto';
import { UpdatePublicidadDto } from './dto/update-publicidad.dto';
import { Publicidad } from './entities/publicidad.entity';
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
    await this.validateReferences(
      dto.idNegocio,
      dto.idSitioAsociado,
      user,
    );
    this.validateFechas(dto.fechaIni, dto.fechaFin);
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

    await this.validateReferences(idNegocio, idSitioAsociado, user);
    this.validateFechas(fechaIni, fechaFin);

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
  ): Promise<void> {
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
  }

  // Requiere que ambas fechas sean válidas y que el cierre sea posterior.
  private validateFechas(fechaIni: string, fechaFin: string): void {
    const inicio = Date.parse(fechaIni);
    const fin = Date.parse(fechaFin);
    if (
      !Number.isFinite(inicio) ||
      !Number.isFinite(fin) ||
      fin <= inicio
    ) {
      throw new BadRequestException(
        'fechaFin debe ser una fecha válida posterior a fechaIni',
      );
    }
  }
}
