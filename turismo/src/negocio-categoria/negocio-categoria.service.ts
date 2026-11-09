import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CategoriaNegocio } from '../categoria-negocio/entities/categoria-negocio.entity';
import { Negocio } from '../negocio/entities/negocio.entity';
import { CreateNegocioCategoriaDto } from './dto/create-negocio-categoria.dto';
import { UpdateNegocioCategoriaDto } from './dto/update-negocio-categoria.dto';
import { NegocioCategoria } from './entities/negocio-categoria.entity';
import { User, UserRole } from '../user/entities/user.entity';

@Injectable()
// Administra la asociación N:M entre negocios y categorías.
export class NegocioCategoriaService {
  // Inyecta el repositorio de asociaciones y la conexión para operaciones transaccionales.
  constructor(
    @InjectRepository(NegocioCategoria)
    private readonly asociacionRepository: Repository<NegocioCategoria>,
    private readonly dataSource: DataSource,
  ) {}

  // Valida ambas referencias y evita duplicar la pareja negocio-categoría.
  async create(
    dto: CreateNegocioCategoriaDto,
    user: User,
  ): Promise<NegocioCategoria> {
    await this.assertOwner(dto.idNegocio, user);
    const [negocioExists, categoriaExists] = await Promise.all([
      this.dataSource.getRepository(Negocio).existsBy({
        idNegocio: dto.idNegocio,
      }),
      this.dataSource.getRepository(CategoriaNegocio).existsBy({
        idCategoriaNeg: dto.idCategoriaNeg,
      }),
    ]);
    if (!negocioExists) {
      throw new NotFoundException(
        `Negocio con ID ${dto.idNegocio} no encontrado`,
      );
    }
    if (!categoriaExists) {
      throw new NotFoundException(
        `Categoría de negocio con ID ${dto.idCategoriaNeg} no encontrada`,
      );
    }
    if (
      await this.asociacionRepository.existsBy({
        idNegocio: dto.idNegocio,
        idCategoriaNeg: dto.idCategoriaNeg,
      })
    ) {
      throw new ConflictException(
        'La categoría ya está asociada a este negocio',
      );
    }
    return await this.asociacionRepository.save(
      this.asociacionRepository.create(dto),
    );
  }

  // Devuelve todas las asociaciones con negocio y categoría.
  async findAll(): Promise<NegocioCategoria[]> {
    return await this.asociacionRepository.find({
      relations: { negocio: true, categoria: true },
    });
  }

  // Busca la asociación mediante su clave compuesta.
  async findOne(
    idNegocio: number,
    idCategoriaNeg: number,
  ): Promise<NegocioCategoria> {
    const asociacion = await this.asociacionRepository.findOne({
      where: { idNegocio, idCategoriaNeg },
      relations: { negocio: true, categoria: true },
    });
    if (!asociacion) {
      throw new NotFoundException(
        'Asociación negocio-categoría no encontrada',
      );
    }
    return asociacion;
  }

  // Cambia las claves en una transacción para conservar la integridad.
  async update(
    idNegocio: number,
    idCategoriaNeg: number,
    dto: UpdateNegocioCategoriaDto,
    user: User,
  ): Promise<NegocioCategoria> {
    const nextIdNegocio = dto.idNegocio ?? idNegocio;
    const nextIdCategoriaNeg = dto.idCategoriaNeg ?? idCategoriaNeg;

    return await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(NegocioCategoria);
      const current = await repository.findOneBy({ idNegocio, idCategoriaNeg });
      if (!current) {
        throw new NotFoundException(
          'Asociación negocio-categoría no encontrada',
        );
      }
      await this.assertOwner(idNegocio, user, manager);
      await this.assertOwner(nextIdNegocio, user, manager);
      if (
        nextIdNegocio === idNegocio &&
        nextIdCategoriaNeg === idCategoriaNeg
      ) {
        return current;
      }

      const [negocioExists, categoriaExists, duplicate] = await Promise.all([
        manager.getRepository(Negocio).existsBy({ idNegocio: nextIdNegocio }),
        manager
          .getRepository(CategoriaNegocio)
          .existsBy({ idCategoriaNeg: nextIdCategoriaNeg }),
        repository.existsBy({
          idNegocio: nextIdNegocio,
          idCategoriaNeg: nextIdCategoriaNeg,
        }),
      ]);
      if (!negocioExists) {
        throw new NotFoundException(
          `Negocio con ID ${nextIdNegocio} no encontrado`,
        );
      }
      if (!categoriaExists) {
        throw new NotFoundException(
          `Categoría de negocio con ID ${nextIdCategoriaNeg} no encontrada`,
        );
      }
      if (duplicate) {
        throw new ConflictException(
          'La categoría ya está asociada a este negocio',
        );
      }

      await repository.save(
        repository.create({
          idNegocio: nextIdNegocio,
          idCategoriaNeg: nextIdCategoriaNeg,
        }),
      );
      await repository.remove(current);
      const updated = await repository.findOne({
        where: {
          idNegocio: nextIdNegocio,
          idCategoriaNeg: nextIdCategoriaNeg,
        },
        relations: { negocio: true, categoria: true },
      });
      if (!updated) {
        throw new NotFoundException(
          'No fue posible recuperar la asociación actualizada',
        );
      }
      return updated;
    });
  }

  // Elimina la relación sin borrar el negocio ni la categoría.
  async remove(
    idNegocio: number,
    idCategoriaNeg: number,
    user: User,
  ): Promise<void> {
    const asociacion = await this.asociacionRepository.findOneBy({
      idNegocio,
      idCategoriaNeg,
    });
    if (!asociacion) {
      throw new NotFoundException(
        'Asociación negocio-categoría no encontrada',
      );
    }
    await this.assertOwner(idNegocio, user);
    await this.asociacionRepository.remove(asociacion);
  }

  private async assertOwner(
    idNegocio: number,
    user: User,
    manager?: EntityManager,
  ): Promise<void> {
    const repository = manager
      ? manager.getRepository(Negocio)
      : this.dataSource.getRepository(Negocio);
    const negocio = await repository.findOneBy({ idNegocio });
    if (!negocio) {
      throw new NotFoundException(
        `Negocio con ID ${idNegocio} no encontrado`,
      );
    }
    if (user.role !== UserRole.Admin && negocio.idUsuario !== user.id) {
      throw new ForbiddenException('No eres propietario de este negocio');
    }
  }
}
