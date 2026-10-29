import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SitioTuristico } from '../sitio-turistico/entities/sitio-turistico.entity';
import { User } from '../user/entities/user.entity';
import { CreateFavoritoDto } from './dto/create-favorito.dto';
import { UpdateFavoritoDto } from './dto/update-favorito.dto';
import { Favorito } from './entities/favorito.entity';

@Injectable()
// CRUD de favoritos con unicidad por usuario y sitio.
export class FavoritoService {
  constructor(
    @InjectRepository(Favorito)
    private readonly favoritoRepository: Repository<Favorito>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(SitioTuristico)
    private readonly sitioRepository: Repository<SitioTuristico>,
    private readonly dataSource: DataSource,
  ) {}

  // Evita favoritos duplicados y comprueba que usuario y sitio existan.
  // Guarda una pareja usuario-sitio única tras validar sus referencias.
  async create(dto: CreateFavoritoDto): Promise<Favorito> {
    await this.validateReferences(dto.idUsuario, dto.idSitio);
    const exists = await this.favoritoRepository.existsBy({
      idUsuario: dto.idUsuario,
      idSitio: dto.idSitio,
    });
    if (exists) {
      throw new ConflictException('El sitio ya está guardado en favoritos');
    }
    return await this.favoritoRepository.save(
      this.favoritoRepository.create(dto),
    );
  }

  // Lista favoritos incluyendo usuario y sitio.
  async findAll(): Promise<Favorito[]> {
    return await this.favoritoRepository.find({
      relations: { usuario: true, sitio: true },
    });
  }

  // Busca un favorito por la clave compuesta usuario-sitio.
  async findOne(idUsuario: number, idSitio: number): Promise<Favorito> {
    const favorito = await this.favoritoRepository.findOne({
      where: { idUsuario, idSitio },
      relations: { usuario: true, sitio: true },
    });
    if (!favorito) {
      throw new NotFoundException('Favorito no encontrado');
    }
    return favorito;
  }

  // Actualiza la pareja de claves de forma atómica y sin crear duplicados.
  // Sustituye la clave compuesta dentro de una transacción.
  async update(
    idUsuario: number,
    idSitio: number,
    dto: UpdateFavoritoDto,
  ): Promise<Favorito> {
    const nextIdUsuario = dto.idUsuario ?? idUsuario;
    const nextIdSitio = dto.idSitio ?? idSitio;

    return await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Favorito);
      const current = await repository.findOneBy({ idUsuario, idSitio });
      if (!current) {
        throw new NotFoundException('Favorito no encontrado');
      }

      if (nextIdUsuario === idUsuario && nextIdSitio === idSitio) {
        return current;
      }

      await this.validateReferences(nextIdUsuario, nextIdSitio, manager);
      const duplicate = await repository.existsBy({
        idUsuario: nextIdUsuario,
        idSitio: nextIdSitio,
      });
      if (duplicate) {
        throw new ConflictException('El sitio ya está guardado en favoritos');
      }

      await repository.save(
        repository.create({
          idUsuario: nextIdUsuario,
          idSitio: nextIdSitio,
        }),
      );
      await repository.remove(current);
      return await repository.findOneByOrFail({
        idUsuario: nextIdUsuario,
        idSitio: nextIdSitio,
      });
    });
  }

  // Elimina el favorito identificado por sus dos claves.
  async remove(idUsuario: number, idSitio: number): Promise<void> {
    const favorito = await this.favoritoRepository.findOneBy({
      idUsuario,
      idSitio,
    });
    if (!favorito) {
      throw new NotFoundException('Favorito no encontrado');
    }
    await this.favoritoRepository.remove(favorito);
  }

  // Verifica que las claves foráneas apunten a registros existentes.
  private async validateReferences(
    idUsuario: number,
    idSitio: number,
    manager = this.dataSource.manager,
  ): Promise<void> {
    const [userExists, sitioExists] = await Promise.all([
      manager.getRepository(User).existsBy({ id: idUsuario }),
      manager.getRepository(SitioTuristico).existsBy({ idSitio }),
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
