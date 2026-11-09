import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CategoriaSitio } from '../categoria-sitio/entities/categoria-sitio.entity';
import { SitioCategoria } from './entities/sitio-categoria.entity';
import { SitioTuristico } from '../sitio-turistico/entities/sitio-turistico.entity';
import { CreateSitioCategoriaDto } from './dto/create-sitio-categoria.dto';
import { UpdateSitioCategoriaDto } from './dto/update-sitio-categoria.dto';
import { GestorZona } from '../gestor-zona/entities/gestor-zona.entity';
import { User, UserRole } from '../user/entities/user.entity';

@Injectable()
// Administra la asociación N:M entre sitios y categorías.
export class SitioCategoriaService {
  constructor(
    @InjectRepository(SitioCategoria)
    private readonly sitioCategoriaRepository: Repository<SitioCategoria>,
    private readonly dataSource: DataSource,
  ) {}

  // Verifica ambas referencias y evita repetir la pareja sitio-categoría.
  async create(
    dto: CreateSitioCategoriaDto,
    user: User,
  ): Promise<SitioCategoria> {
    await this.assertCanManageSite(dto.idSitio, user);
    const [sitioExists, categoriaExists] = await Promise.all([
      this.dataSource.getRepository(SitioTuristico).existsBy({
        idSitio: dto.idSitio,
      }),
      this.dataSource.getRepository(CategoriaSitio).existsBy({
        idCategoria: dto.idCategoria,
      }),
    ]);
    if (!sitioExists) {
      throw new NotFoundException(
        `Sitio turístico con ID ${dto.idSitio} no encontrado`,
      );
    }
    if (!categoriaExists) {
      throw new NotFoundException(
        `Categoría con ID ${dto.idCategoria} no encontrada`,
      );
    }

    const exists = await this.sitioCategoriaRepository.existsBy({
      idSitio: dto.idSitio,
      idCategoria: dto.idCategoria,
    });
    if (exists) {
      throw new ConflictException('La categoría ya está asociada a este sitio');
    }
    return await this.sitioCategoriaRepository.save(
      this.sitioCategoriaRepository.create(dto),
    );
  }

  // Devuelve las asociaciones con sus entidades relacionadas.
  async findAll(): Promise<SitioCategoria[]> {
    return await this.sitioCategoriaRepository.find({
      relations: { sitio: true, categoria: true },
    });
  }

  // Busca la asociación mediante su clave compuesta.
  async findOne(idSitio: number, idCategoria: number): Promise<SitioCategoria> {
    const association = await this.sitioCategoriaRepository.findOne({
      where: { idSitio, idCategoria },
      relations: { sitio: true, categoria: true },
    });
    if (!association) {
      throw new NotFoundException('Asociación sitio-categoría no encontrada');
    }
    return association;
  }

  // Cambia la pareja de claves en una transacción para conservar su integridad.
  async update(
    idSitio: number,
    idCategoria: number,
    dto: UpdateSitioCategoriaDto,
    user: User,
  ): Promise<SitioCategoria> {
    const nextIdSitio = dto.idSitio ?? idSitio;
    const nextIdCategoria = dto.idCategoria ?? idCategoria;

    return await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(SitioCategoria);
      const current = await repository.findOneBy({ idSitio, idCategoria });
      if (!current) {
        throw new NotFoundException('Asociación sitio-categoría no encontrada');
      }
      await this.assertCanManageSite(idSitio, user, manager);
      await this.assertCanManageSite(nextIdSitio, user, manager);

      if (nextIdSitio === idSitio && nextIdCategoria === idCategoria) {
        return current;
      }

      const [sitio, categoria, duplicate] = await Promise.all([
        manager.getRepository(SitioTuristico).existsBy({ idSitio: nextIdSitio }),
        manager
          .getRepository(CategoriaSitio)
          .existsBy({ idCategoria: nextIdCategoria }),
        repository.existsBy({
          idSitio: nextIdSitio,
          idCategoria: nextIdCategoria,
        }),
      ]);

      if (!sitio) {
        throw new NotFoundException(
          `Sitio turístico con ID ${nextIdSitio} no encontrado`,
        );
      }
      if (!categoria) {
        throw new NotFoundException(
          `Categoría con ID ${nextIdCategoria} no encontrada`,
        );
      }
      if (duplicate) {
        throw new ConflictException(
          'La categoría ya está asociada a este sitio',
        );
      }

      await repository.save(
        repository.create({
          idSitio: nextIdSitio,
          idCategoria: nextIdCategoria,
        }),
      );
      await repository.remove(current);

      return await repository.findOneByOrFail({
        idSitio: nextIdSitio,
        idCategoria: nextIdCategoria,
      });
    });
  }

  // Elimina la asociación sin borrar el sitio ni la categoría.
  async remove(
    idSitio: number,
    idCategoria: number,
    user: User,
  ): Promise<void> {
    const association = await this.sitioCategoriaRepository.findOneBy({
      idSitio,
      idCategoria,
    });
    if (!association) {
      throw new NotFoundException('Asociación sitio-categoría no encontrada');
    }
    await this.assertCanManageSite(idSitio, user);
    await this.sitioCategoriaRepository.remove(association);
  }

  private async assertCanManageSite(
    idSitio: number,
    user: User,
    manager?: EntityManager,
  ): Promise<void> {
    const sitio = await (manager
      ? manager.getRepository(SitioTuristico)
      : this.dataSource.getRepository(SitioTuristico)
    ).findOneBy({ idSitio });
    if (!sitio) {
      throw new NotFoundException(
        `Sitio turístico con ID ${idSitio} no encontrado`,
      );
    }
    if (user.role === UserRole.Admin) {
      return;
    }
    const assigned = await (manager
      ? manager.getRepository(GestorZona)
      : this.dataSource.getRepository(GestorZona)
    ).existsBy({ idUsuario: user.id, idZona: sitio.idZona });
    if (!assigned) {
      throw new ForbiddenException('No tienes permisos sobre esta zona');
    }
  }
}
