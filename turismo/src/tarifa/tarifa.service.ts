import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Servicio } from '../servicio/entities/servicio.entity';
import { CreateTarifaDto } from './dto/create-tarifa.dto';
import { UpdateTarifaDto } from './dto/update-tarifa.dto';
import { Tarifa } from './entities/tarifa.entity';

@Injectable()
// Gestiona tarifas, su servicio asociado y la coherencia de su vigencia.
export class TarifaService {
  // Inyecta repositorios para tarifas y para validar sus servicios asociados.
  constructor(
    @InjectRepository(Tarifa)
    private readonly tarifaRepository: Repository<Tarifa>,
    @InjectRepository(Servicio)
    private readonly servicioRepository: Repository<Servicio>,
  ) {}

  // Valida el servicio y el período antes de guardar una tarifa.
  async create(dto: CreateTarifaDto): Promise<Tarifa> {
    await this.validateServicio(dto.idServicio);
    this.validateVigencia(dto.vigenciaIni, dto.vigenciaFin);
    return await this.tarifaRepository.save(
      this.tarifaRepository.create({ ...dto, precio: String(dto.precio) }),
    );
  }

  // Lista tarifas incluyendo el servicio al que pertenecen.
  async findAll(): Promise<Tarifa[]> {
    return await this.tarifaRepository.find({ relations: { servicio: true } });
  }

  // Busca una tarifa por ID junto con su servicio.
  async findOne(id: number): Promise<Tarifa> {
    const tarifa = await this.tarifaRepository.findOne({
      where: { idTarifa: id },
      relations: { servicio: true },
    });
    if (!tarifa) {
      throw new NotFoundException(`Tarifa con ID ${id} no encontrada`);
    }
    return tarifa;
  }

  // Actualiza la tarifa verificando referencias y fechas resultantes.
  async update(id: number, dto: UpdateTarifaDto): Promise<Tarifa> {
    const tarifa = await this.tarifaRepository.findOneBy({ idTarifa: id });
    if (!tarifa) {
      throw new NotFoundException(`Tarifa con ID ${id} no encontrada`);
    }
    const idServicio = dto.idServicio ?? tarifa.idServicio;
    const vigenciaIni = dto.vigenciaIni ?? tarifa.vigenciaIni;
    const vigenciaFin = dto.vigenciaFin ?? tarifa.vigenciaFin;
    if (dto.idServicio !== undefined) {
      await this.validateServicio(idServicio);
    }
    this.validateVigencia(vigenciaIni, vigenciaFin);

    this.tarifaRepository.merge(tarifa, {
      ...dto,
      precio: dto.precio === undefined ? undefined : String(dto.precio),
    });
    await this.tarifaRepository.save(tarifa);
    return await this.findOne(id);
  }

  // Elimina la tarifa indicada.
  async remove(id: number): Promise<void> {
    const tarifa = await this.tarifaRepository.findOneBy({ idTarifa: id });
    if (!tarifa) {
      throw new NotFoundException(`Tarifa con ID ${id} no encontrada`);
    }
    await this.tarifaRepository.remove(tarifa);
  }

  // Confirma que el servicio de destino exista.
  private async validateServicio(idServicio: number): Promise<void> {
    const exists = await this.servicioRepository.existsBy({ idServicio });
    if (!exists) {
      throw new NotFoundException(
        `Servicio con ID ${idServicio} no encontrado`,
      );
    }
  }

  // Garantiza que el fin del período no sea anterior a su inicio.
  private validateVigencia(vigenciaIni: string, vigenciaFin: string): void {
    const inicio = Date.parse(vigenciaIni);
    const fin = Date.parse(vigenciaFin);
    if (!Number.isFinite(inicio) || !Number.isFinite(fin) || fin < inicio) {
      throw new BadRequestException(
        'vigenciaIni y vigenciaFin deben ser fechas válidas y vigenciaFin debe ser igual o posterior',
      );
    }
  }
}
