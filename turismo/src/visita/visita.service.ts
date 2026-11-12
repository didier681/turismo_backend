import {
  ForbiddenException,
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
  async create(dto: CreateVisitaDto, user: User): Promise<Visita> {
    await this.validateReferences(user.id, dto.idZona, dto.idSitio);
    return await this.visitaRepository.save(
      this.visitaRepository.create({ ...dto, idUsuario: user.id }),
    );
  }

  // Devuelve las visitas con el usuario, zona y sitio relacionados.
  async findAll(): Promise<Visita[]> {
    return await this.visitaRepository.find({
      relations: { usuario: true, zona: true, sitio: true },
    });
  }

  // Retorna exclusivamente visitas del usuario identificado por el JWT.
  async findMias(user: User): Promise<Visita[]> {
    return await this.visitaRepository.find({
      where: { idUsuario: user.id },
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
  async update(
    id: number,
    dto: UpdateVisitaDto,
    user: User,
  ): Promise<Visita> {
    const visita = await this.visitaRepository.findOneBy({ idVisita: id });
    if (!visita) {
      throw new NotFoundException(`Visita con ID ${id} no encontrada`);
    }
    this.assertOwner(visita, user);

    const idZona = dto.idZona ?? visita.idZona;
    const idSitio = dto.idSitio ?? visita.idSitio;
    await this.validateReferences(user.id, idZona, idSitio);

    this.visitaRepository.merge(visita, dto);
    await this.visitaRepository.save(visita);
    return await this.findOne(id);
  }

  // Elimina la visita indicada.
  async remove(id: number, user: User): Promise<void> {
    const visita = await this.visitaRepository.findOneBy({ idVisita: id });
    if (!visita) {
      throw new NotFoundException(`Visita con ID ${id} no encontrada`);
    }
    this.assertOwner(visita, user);
    await this.visitaRepository.remove(visita);
  }

  private assertOwner(visita: Visita, user: User): void {
    if (visita.idUsuario !== user.id) {
      throw new ForbiddenException('No puedes modificar la visita de otro usuario');
    }
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
