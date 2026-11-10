import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { SitioTuristico } from '../sitio-turistico/entities/sitio-turistico.entity';
import { User } from '../user/entities/user.entity';
import { CreateResenaDto } from './dto/create-resena.dto';
import { UpdateResenaDto } from './dto/update-resena.dto';
import { Resena } from './entities/resena.entity';

@Injectable()
// CRUD de reseñas con comprobación de usuario y sitio asociados.
export class ResenaService {
  constructor(
    @InjectRepository(Resena)
    private readonly resenaRepository: Repository<Resena>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(SitioTuristico)
    private readonly sitioRepository: Repository<SitioTuristico>,
  ) {}

  // Crea una reseña tras confirmar la existencia del usuario y del sitio.
  async create(dto: CreateResenaDto, user: User): Promise<Resena> {
    await this.validateReferences(user.id, dto.idSitio);
    if (
      await this.resenaRepository.existsBy({
        idUsuario: user.id,
        idSitio: dto.idSitio,
      })
    ) {
      throw new ConflictException(
        'Ya tienes una reseña para este sitio turístico',
      );
    }
    try {
      return await this.resenaRepository.save(
        this.resenaRepository.create({ ...dto, idUsuario: user.id }),
      );
    } catch (error) {
      if (esDuplicadoDeBaseDeDatos(error)) {
        throw new ConflictException(
          'Ya tienes una reseña para este sitio turístico',
        );
      }
      throw error;
    }
  }

  // Lista reseñas incluyendo el autor y el sitio reseñado.
  async findAll(): Promise<Resena[]> {
    return await this.resenaRepository.find({
      relations: { usuario: true, sitio: true },
    });
  }

  // Busca una reseña por ID y carga sus relaciones.
  async findOne(id: number): Promise<Resena> {
    const resena = await this.resenaRepository.findOne({
      where: { idResena: id },
      relations: { usuario: true, sitio: true },
    });
    if (!resena) {
      throw new NotFoundException(`Reseña con ID ${id} no encontrada`);
    }
    return resena;
  }

  // Actualiza la reseña y valida cualquier cambio de usuario o sitio.
  async update(
    id: number,
    dto: UpdateResenaDto,
    user: User,
  ): Promise<Resena> {
    const resena = await this.resenaRepository.findOneBy({ idResena: id });
    if (!resena) {
      throw new NotFoundException(`Reseña con ID ${id} no encontrada`);
    }
    this.assertOwner(resena, user);

    const idSitio = dto.idSitio ?? resena.idSitio;
    await this.validateReferences(user.id, idSitio);
    if (
      idSitio !== resena.idSitio &&
      (await this.resenaRepository.existsBy({
        idUsuario: user.id,
        idSitio,
      }))
    ) {
      throw new ConflictException(
        'Ya tienes una reseña para este sitio turístico',
      );
    }

    this.resenaRepository.merge(resena, dto);
    try {
      await this.resenaRepository.save(resena);
    } catch (error) {
      if (esDuplicadoDeBaseDeDatos(error)) {
        throw new ConflictException(
          'Ya tienes una reseña para este sitio turístico',
        );
      }
      throw error;
    }
    return await this.findOne(id);
  }

  // Elimina la reseña indicada.
  async remove(id: number, user: User): Promise<void> {
    const resena = await this.resenaRepository.findOneBy({ idResena: id });
    if (!resena) {
      throw new NotFoundException(`Reseña con ID ${id} no encontrada`);
    }
    this.assertOwner(resena, user);
    await this.resenaRepository.remove(resena);
  }

  private assertOwner(resena: Resena, user: User): void {
    if (resena.idUsuario !== user.id) {
      throw new ForbiddenException(
        'No puedes modificar la reseña de otro usuario',
      );
    }
  }

  // Confirma que el autor y el sitio existan antes de guardar la reseña.
  private async validateReferences(
    idUsuario: number,
    idSitio: number,
  ): Promise<void> {
    const [userExists, sitioExists] = await Promise.all([
      this.userRepository.existsBy({ id: idUsuario }),
      this.sitioRepository.existsBy({ idSitio }),
    ]);
    if (!userExists) {
      throw new NotFoundException(`Usuario con ID ${idUsuario} no encontrado`);
    }
    if (!sitioExists) {
      throw new NotFoundException(
        `Sitio turístico con ID ${idSitio} no encontrado`,
      );
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
