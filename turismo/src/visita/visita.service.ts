import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SitioTuristico } from '../sitio-turistico/entities/sitio-turistico.entity';
import { User } from '../user/entities/user.entity';
import { Zona } from '../zona/entities/zona.entity';
import { CreateVisitaDto } from './dto/create-visita.dto';
import { UpdateVisitaDto } from './dto/update-visita.dto';
import { Visita } from './entities/visita.entity';

@Injectable()
// CRUD del historial de visitas y validación de sus relaciones geográficas.
export class VisitaService {
  constructor(
    @InjectRepository(Visita)
    private readonly visitaRepository: Repository<Visita>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Zona)
    private readonly zonaRepository: Repository<Zona>,
    @InjectRepository(SitioTuristico)
    private readonly sitioRepository: Repository<SitioTuristico>,
  ) {}

  // Registra la visita después de validar sus tres referencias.
  async create(dto: CreateVisitaDto): Promise<Visita> {
    await this.validateReferences(dto.idUsuario, dto.idZona, dto.idSitio);
    return await this.visitaRepository.save(this.visitaRepository.create(dto));
  }

  // Devuelve las visitas con el usuario, zona y sitio relacionados.
  async findAll(): Promise<Visita[]> {
    return await this.visitaRepository.find({
      relations: { usuario: true, zona: true, sitio: true },
    });
  }

  // Recupera una visita por ID con su contexto completo.
  async findOne(id: number): Promise<Visita> {
    const visita = await this.visitaRepository.findOne({
      where: { idVisita: id },
      relations: { usuario: true, zona: true, sitio: true },
    });
    if (!visita) {
      throw new NotFoundException(`Visita con ID ${id} no encontrada`);
    }
    return visita;
  }

  // Actualiza la visita y vuelve a validar las referencias resultantes.
  async update(id: number, dto: UpdateVisitaDto): Promise<Visita> {
    const visita = await this.visitaRepository.findOneBy({ idVisita: id });
    if (!visita) {
      throw new NotFoundException(`Visita con ID ${id} no encontrada`);
    }

    const idUsuario = dto.idUsuario ?? visita.idUsuario;
    const idZona = dto.idZona ?? visita.idZona;
    const idSitio = dto.idSitio ?? visita.idSitio;
    await this.validateReferences(idUsuario, idZona, idSitio);

    this.visitaRepository.merge(visita, dto);
    await this.visitaRepository.save(visita);
    return await this.findOne(id);
  }

  // Elimina la visita indicada.
  async remove(id: number): Promise<void> {
    const visita = await this.visitaRepository.findOneBy({ idVisita: id });
    if (!visita) {
      throw new NotFoundException(`Visita con ID ${id} no encontrada`);
    }
    await this.visitaRepository.remove(visita);
  }

  // Confirma que las entidades existan y que el sitio pertenezca a la zona.
  private async validateReferences(
    idUsuario: number,
    idZona: number,
    idSitio: number,
  ): Promise<void> {
    const [userExists, zona, sitio] = await Promise.all([
      this.userRepository.existsBy({ id: idUsuario }),
      this.zonaRepository.findOneBy({ idZona }),
      this.sitioRepository.findOneBy({ idSitio }),
    ]);

    if (!userExists) {
      throw new NotFoundException(`Usuario con ID ${idUsuario} no encontrado`);
    }
    if (!zona) {
      throw new NotFoundException(`Zona con ID ${idZona} no encontrada`);
    }
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
