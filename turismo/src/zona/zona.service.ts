import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateZonaDto } from './dto/create-zona.dto';
import { UpdateZonaDto } from './dto/update-zona.dto';
import { Zona } from './entities/zona.entity';
import { SitioTuristico } from '../sitio-turistico/entities/sitio-turistico.entity';

@Injectable()
// Reglas de negocio y persistencia CRUD para las zonas geográficas.
export class ZonaService {
  constructor(
    @InjectRepository(Zona)
    private readonly zonaRepository: Repository<Zona>,
    @InjectRepository(SitioTuristico)
    private readonly sitioRepository: Repository<SitioTuristico>,
  ) {}

  // Crea una zona con los datos validados por el DTO.
  async create(dto: CreateZonaDto): Promise<Zona> {
    return await this.zonaRepository.save(this.zonaRepository.create(dto));
  }

  // Lista las zonas disponibles.
  async findAll(): Promise<Zona[]> {
    return await this.zonaRepository.find();
  }

  // Busca una zona o responde con 404 si no existe.
  async findOne(id: number): Promise<Zona> {
    const zona = await this.zonaRepository.findOneBy({ idZona: id });
    if (!zona) {
      throw new NotFoundException(`Zona con ID ${id} no encontrada`);
    }
    return zona;
  }

  // Aplica solo los campos enviados y persiste la zona.
  async update(id: number, dto: UpdateZonaDto): Promise<Zona> {
    const zona = await this.findOne(id);
    this.zonaRepository.merge(zona, dto);
    return await this.zonaRepository.save(zona);
  }

  // Evita dejar sitios turísticos sin su zona obligatoria.
  // Elimina la zona únicamente cuando no tiene sitios asociados.
  async remove(id: number): Promise<void> {
    const zona = await this.findOne(id);
    const hasSites = await this.sitioRepository.existsBy({ idZona: id });
    if (hasSites) {
      throw new ConflictException(
        'No se puede eliminar una zona que tiene sitios turísticos asociados',
      );
    }
    await this.zonaRepository.remove(zona);
  }
}
