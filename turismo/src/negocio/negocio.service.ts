import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { SitioTuristico } from '../sitio-turistico/entities/sitio-turistico.entity';
import { Zona } from '../zona/entities/zona.entity';
import { CreateNegocioDto } from './dto/create-negocio.dto';
import { UpdateNegocioDto } from './dto/update-negocio.dto';
import { Negocio } from './entities/negocio.entity';
import { User, UserRole } from '../user/entities/user.entity';

@Injectable()
// Gestiona negocios, que siempre pertenecen a una zona y pueden asociarse a un sitio.
export class NegocioService {
  // Inyecta repositorios para validar la zona obligatoria y el sitio opcional.
  constructor(
    @InjectRepository(Negocio)
    private readonly negocioRepository: Repository<Negocio>,
    @InjectRepository(SitioTuristico)
    private readonly sitioRepository: Repository<SitioTuristico>,
    @InjectRepository(Zona)
    private readonly zonaRepository: Repository<Zona>,
  ) {}

  // Valida la zona y, si se indicó, que el sitio exista y pertenezca a esa zona.
  async create(dto: CreateNegocioDto, user: User): Promise<Negocio> {
    this.validateCoordinates(dto.latitud, dto.longitud);
    await this.validateReferences(dto.idZona, dto.idSitio);
    await this.validateNit(dto.nitDocumento);
    try {
      return await this.negocioRepository.save(
        this.negocioRepository.create({
          ...dto,
          idUsuario: user.id,
          idSitio: dto.idSitio ?? null,
          latitud: String(dto.latitud),
          longitud: String(dto.longitud),
        }),
      );
    } catch (error) {
      if (esDuplicadoDeBaseDeDatos(error)) {
        throw new ConflictException(
          'Ya existe un negocio registrado con ese NIT o documento',
        );
      }
      throw error;
    }
  }

  // Lista negocios con el sitio y las categorías asociados.
  async findAll(): Promise<Negocio[]> {
    return await this.negocioRepository.find({
      relations: {
        zona: true,
        sitio: true,
        categorias: { categoria: true },
        servicios: true,
      },
    });
  }

  // Recupera un negocio y sus relaciones o responde con 404.
  async findOne(id: number): Promise<Negocio> {
    const negocio = await this.negocioRepository.findOne({
      where: { idNegocio: id },
      relations: {
        zona: true,
        sitio: true,
        categorias: { categoria: true },
        servicios: true,
      },
    });
    if (!negocio) {
      throw new NotFoundException(`Negocio con ID ${id} no encontrado`);
    }
    return negocio;
  }

  // Actualiza el negocio y valida la zona y el sitio opcional resultantes.
  async update(
    id: number,
    dto: UpdateNegocioDto,
    user: User,
  ): Promise<Negocio> {
    const negocio = await this.negocioRepository.findOneBy({ idNegocio: id });
    if (!negocio) {
      throw new NotFoundException(`Negocio con ID ${id} no encontrado`);
    }
    this.assertOwner(negocio, user);
    const latitud = dto.latitud ?? Number(negocio.latitud);
    const longitud = dto.longitud ?? Number(negocio.longitud);
    this.validateCoordinates(latitud, longitud);
    const idZona = dto.idZona ?? negocio.idZona;
    const idSitio = dto.idSitio === undefined ? negocio.idSitio : dto.idSitio;
    await this.validateReferences(idZona, idSitio);
    const nitDocumento = dto.nitDocumento ?? negocio.nitDocumento;
    await this.validateNit(nitDocumento, id);
    this.negocioRepository.merge(negocio, {
      ...dto,
      idSitio: dto.idSitio === undefined ? undefined : dto.idSitio,
      latitud: dto.latitud === undefined ? undefined : String(dto.latitud),
      longitud: dto.longitud === undefined ? undefined : String(dto.longitud),
    });
    try {
      await this.negocioRepository.save(negocio);
    } catch (error) {
      if (esDuplicadoDeBaseDeDatos(error)) {
        throw new ConflictException(
          'Ya existe un negocio registrado con ese NIT o documento',
        );
      }
      throw error;
    }
    return await this.findOne(id);
  }

  // Elimina el negocio indicado.
  async remove(id: number, user: User): Promise<void> {
    const negocio = await this.negocioRepository.findOneBy({ idNegocio: id });
    if (!negocio) {
      throw new NotFoundException(`Negocio con ID ${id} no encontrado`);
    }
    this.assertOwner(negocio, user);
    await this.negocioRepository.remove(negocio);
  }

  private assertOwner(negocio: Negocio, user: User): void {
    if (user.role !== UserRole.Admin && negocio.idUsuario !== user.id) {
      throw new ForbiddenException('No eres propietario de este negocio');
    }
  }

  private validateCoordinates(latitud: number, longitud: number): void {
    if (!Number.isFinite(latitud) || latitud < -90 || latitud > 90) {
      throw new BadRequestException(
        'La latitud debe ser un número entre -90 y 90',
      );
    }
    if (!Number.isFinite(longitud) || longitud < -180 || longitud > 180) {
      throw new BadRequestException(
        'La longitud debe ser un número entre -180 y 180',
      );
    }
  }

  private async validateNit(
    nitDocumento: string,
    excludeId?: number,
  ): Promise<void> {
    const existing = await this.negocioRepository.findOneBy({ nitDocumento });
    if (existing && existing.idNegocio !== excludeId) {
      throw new ConflictException(
        'Ya existe un negocio registrado con ese NIT o documento',
      );
    }
  }

  // Confirma que la zona exista y que el sitio opcional pertenezca a esa zona.
  private async validateReferences(
    idZona: number,
    idSitio: number | null | undefined,
  ): Promise<void> {
    const zona = await this.zonaRepository.findOneBy({ idZona });
    if (!zona) {
      throw new NotFoundException(`Zona con ID ${idZona} no encontrada`);
    }

    if (idSitio !== null && idSitio !== undefined) {
      const sitio = await this.sitioRepository.findOneBy({ idSitio });
      if (!sitio) {
        throw new NotFoundException(
          `Sitio turístico con ID ${idSitio} no encontrado`,
        );
      }
      if (sitio.idZona !== idZona) {
        throw new UnprocessableEntityException(
          'El sitio turístico no pertenece a la zona indicada',
        );
      }
    }

  }
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
