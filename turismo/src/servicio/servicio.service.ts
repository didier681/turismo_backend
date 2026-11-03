import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Negocio } from '../negocio/entities/negocio.entity';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { Servicio } from './entities/servicio.entity';

@Injectable()
// Gestiona servicios y verifica el negocio al que pertenecen.
export class ServicioService {
  constructor(
    @InjectRepository(Servicio)
    private readonly servicioRepository: Repository<Servicio>,
    @InjectRepository(Negocio)
    private readonly negocioRepository: Repository<Negocio>,
  ) {}

  // Valida el negocio antes de registrar un servicio.
  async create(dto: CreateServicioDto): Promise<Servicio> {
    await this.validateNegocio(dto.idNegocio);
    return await this.servicioRepository.save(
      this.servicioRepository.create(dto),
    );
  }

  // Lista servicios incluyendo negocio y tarifas.
  async findAll(): Promise<Servicio[]> {
    return await this.servicioRepository.find({
      relations: { negocio: true, tarifas: true },
    });
  }

  // Busca un servicio por ID junto con sus relaciones.
  async findOne(id: number): Promise<Servicio> {
    const servicio = await this.servicioRepository.findOne({
      where: { idServicio: id },
      relations: { negocio: true, tarifas: true },
    });
    if (!servicio) {
      throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    }
    return servicio;
  }

  // Actualiza el servicio y valida el negocio si cambia la referencia.
  async update(id: number, dto: UpdateServicioDto): Promise<Servicio> {
    const servicio = await this.servicioRepository.findOneBy({
      idServicio: id,
    });
    if (!servicio) {
      throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    }
    if (dto.idNegocio !== undefined) {
      await this.validateNegocio(dto.idNegocio);
    }
    this.servicioRepository.merge(servicio, dto);
    await this.servicioRepository.save(servicio);
    return await this.findOne(id);
  }

  // Elimina el servicio indicado.
  async remove(id: number): Promise<void> {
    const servicio = await this.servicioRepository.findOneBy({
      idServicio: id,
    });
    if (!servicio) {
      throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    }
    await this.servicioRepository.remove(servicio);
  }

  // Confirma que el negocio al que se vincula el servicio exista.
  private async validateNegocio(idNegocio: number): Promise<void> {
    const exists = await this.negocioRepository.existsBy({ idNegocio });
    if (!exists) {
      throw new NotFoundException(`Negocio con ID ${idNegocio} no encontrado`);
    }
  }
}
