import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SitioTuristico } from '../sitio-turistico/entities/sitio-turistico.entity';
import { CreateNegocioDto } from './dto/create-negocio.dto';
import { UpdateNegocioDto } from './dto/update-negocio.dto';
import { Negocio } from './entities/negocio.entity';

@Injectable()
// Gestiona negocios y valida el sitio turístico asociado.
export class NegocioService {
  constructor(
    @InjectRepository(Negocio)
    private readonly negocioRepository: Repository<Negocio>,
    @InjectRepository(SitioTuristico)
    private readonly sitioRepository: Repository<SitioTuristico>,
  ) {}

  // Comprueba la existencia del sitio antes de crear el negocio.
  async create(dto: CreateNegocioDto): Promise<Negocio> {
    await this.validateSitio(dto.idSitio);
    return await this.negocioRepository.save(
      this.negocioRepository.create({
        ...dto,
        latitud: String(dto.latitud),
        longitud: String(dto.longitud),
      }),
    );
  }

  // Lista negocios con el sitio y las categorías asociados.
  async findAll(): Promise<Negocio[]> {
    return await this.negocioRepository.find({
      relations: {
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

  // Actualiza el negocio y valida el sitio cuando se modifica su referencia.
  async update(id: number, dto: UpdateNegocioDto): Promise<Negocio> {
    const negocio = await this.negocioRepository.findOneBy({ idNegocio: id });
    if (!negocio) {
      throw new NotFoundException(`Negocio con ID ${id} no encontrado`);
    }
    if (dto.idSitio !== undefined) {
      await this.validateSitio(dto.idSitio);
    }
    this.negocioRepository.merge(negocio, {
      ...dto,
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

  // Confirma que el sitio turístico solicitado exista.
  private async validateSitio(idSitio: number): Promise<void> {
    const exists = await this.sitioRepository.existsBy({ idSitio });
    if (!exists) {
      throw new NotFoundException(
        `Sitio turístico con ID ${idSitio} no encontrado`,
      );
    }
  }
}
