import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SitioTuristico } from '../sitio-turistico/entities/sitio-turistico.entity';
import { Zona } from '../zona/entities/zona.entity';
import { CreateNegocioDto } from './dto/create-negocio.dto';
import { UpdateNegocioDto } from './dto/update-negocio.dto';
import { Negocio } from './entities/negocio.entity';

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
  async create(dto: CreateNegocioDto): Promise<Negocio> {
    await this.validateReferences(dto.idZona, dto.idSitio);
    return await this.negocioRepository.save(
      this.negocioRepository.create({
        ...dto,
        idSitio: dto.idSitio ?? null,
        latitud: String(dto.latitud),
        longitud: String(dto.longitud),
      }),
    );
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
  async update(id: number, dto: UpdateNegocioDto): Promise<Negocio> {
    const negocio = await this.negocioRepository.findOneBy({ idNegocio: id });
    if (!negocio) {
      throw new NotFoundException(`Negocio con ID ${id} no encontrado`);
    }
    const idZona = dto.idZona ?? negocio.idZona;
    const idSitio = dto.idSitio === undefined ? negocio.idSitio : dto.idSitio;
    await this.validateReferences(idZona, idSitio);
    this.negocioRepository.merge(negocio, {
      ...dto,
      idSitio: dto.idSitio === undefined ? undefined : dto.idSitio,
      latitud: dto.latitud === undefined ? undefined : String(dto.latitud),
      longitud: dto.longitud === undefined ? undefined : String(dto.longitud),
    });
    await this.negocioRepository.save(negocio);
    return await this.findOne(id);
  }

  // Elimina el negocio indicado.
  async remove(id: number): Promise<void> {
    const negocio = await this.negocioRepository.findOneBy({ idNegocio: id });
    if (!negocio) {
      throw new NotFoundException(`Negocio con ID ${id} no encontrado`);
    }
    await this.negocioRepository.remove(negocio);
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
