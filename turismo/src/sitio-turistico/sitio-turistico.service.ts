import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SitioTuristico } from './entities/sitio-turistico.entity';
import { Zona } from '../zona/entities/zona.entity';
import { CreateSitioTuristicoDto } from './dto/create-sitio-turistico.dto';
import { UpdateSitioTuristicoDto } from './dto/update-sitio-turistico.dto';

@Injectable()
// Gestiona sitios turísticos y comprueba su zona antes de guardar cambios.
export class SitioTuristicoService {
  constructor(
    @InjectRepository(SitioTuristico)
    private readonly sitioRepository: Repository<SitioTuristico>,
    @InjectRepository(Zona)
    private readonly zonaRepository: Repository<Zona>,
  ) {}

  // Comprueba la zona asociada antes de guardar el nuevo sitio.
  async create(dto: CreateSitioTuristicoDto): Promise<SitioTuristico> {
    const zoneExists = await this.zonaRepository.existsBy({
      idZona: dto.idZona,
    });
    if (!zoneExists) {
      throw new NotFoundException(`Zona con ID ${dto.idZona} no encontrada`);
    }
    return await this.sitioRepository.save(this.sitioRepository.create(dto));
  }

  // Incluye la zona y las categorías para entregar el contexto del sitio.
  // Lista sitios incluyendo su zona y las categorías vinculadas.
  async findAll(): Promise<SitioTuristico[]> {
    return await this.sitioRepository.find({
      relations: { zona: true, categorias: { categoria: true } },
    });
  }

  // Devuelve el sitio con sus relaciones o informa que no existe.
  // Recupera un sitio y sus relaciones o responde con 404.
  async findOne(id: number): Promise<SitioTuristico> {
    const sitio = await this.sitioRepository.findOne({
      where: { idSitio: id },
      relations: { zona: true, categorias: { categoria: true } },
    });
    if (!sitio) {
      throw new NotFoundException(`Sitio turístico con ID ${id} no encontrado`);
    }
    return sitio;
  }

  // Valida la zona si cambia y guarda los campos recibidos.
  async update(
    id: number,
    dto: UpdateSitioTuristicoDto,
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
    this.sitioRepository.merge(sitio, dto);
    return await this.sitioRepository.save(sitio);
  }

  // Elimina el sitio indicado o responde con 404 si no existe.
  async remove(id: number): Promise<void> {
    const sitio = await this.sitioRepository.findOneBy({ idSitio: id });
    if (!sitio) {
      throw new NotFoundException(`Sitio turístico con ID ${id} no encontrado`);
    }
    await this.sitioRepository.remove(sitio);
  }
}
