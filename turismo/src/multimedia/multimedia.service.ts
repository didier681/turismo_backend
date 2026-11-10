import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Negocio } from '../negocio/entities/negocio.entity';
import { SitioTuristico } from '../sitio-turistico/entities/sitio-turistico.entity';
import { CreateMultimediaDto } from './dto/create-multimedia.dto';
import { UpdateMultimediaDto } from './dto/update-multimedia.dto';
import {
  Multimedia,
  TipoContenidoMultimedia,
  TipoEntidadMultimedia,
} from './entities/multimedia.entity';
import { User, UserRole } from '../user/entities/user.entity';

@Injectable()
// Gestiona contenido multimedia y valida su entidad polimórfica y formato.
export class MultimediaService {
  // Inyecta el repositorio de multimedia y los repositorios de entidades asociables.
  constructor(
    @InjectRepository(Multimedia)
    private readonly multimediaRepository: Repository<Multimedia>,
    @InjectRepository(SitioTuristico)
    private readonly sitioRepository: Repository<SitioTuristico>,
    @InjectRepository(Negocio)
    private readonly negocioRepository: Repository<Negocio>,
  ) {}

  // Valida la referencia y el contenido antes de crear el registro.
  async create(dto: CreateMultimediaDto, user: User): Promise<Multimedia> {
    await this.validateEntidad(dto.tipoEntidad, dto.idEntidad, user);
    const cantidad = await this.multimediaRepository.countBy({
      tipoEntidad: dto.tipoEntidad,
      idEntidad: dto.idEntidad,
    });
    if (cantidad >= 10) {
      throw new BadRequestException(
        'No se pueden registrar más de 10 archivos multimedia por sitio o negocio',
      );
    }
    this.validateContenido(
      dto.tipoContenido,
      dto.urlContenido,
      dto.textoContenido,
    );
    return await this.multimediaRepository.save(
      this.multimediaRepository.create({
        ...dto,
        urlContenido: dto.urlContenido ?? null,
        textoContenido: dto.textoContenido ?? null,
      }),
    );
  }

  // Lista todos los registros multimedia.
  async findAll(): Promise<Multimedia[]> {
    return await this.multimediaRepository.find({ order: { orden: 'ASC' } });
  }

  // Lista el contenido de una entidad, ordenado por el campo orden.
  async findByEntidad(
    tipoEntidad: TipoEntidadMultimedia,
    idEntidad: number,
  ): Promise<Multimedia[]> {
    await this.validateEntidad(tipoEntidad, idEntidad);
    return await this.multimediaRepository.find({
      where: { tipoEntidad, idEntidad },
      order: { orden: 'ASC' },
    });
  }

  // Busca un registro multimedia por su identificador.
  async findOne(id: number): Promise<Multimedia> {
    const multimedia = await this.multimediaRepository.findOneBy({
      idMultimedia: id,
    });
    if (!multimedia) {
      throw new NotFoundException(`Multimedia con ID ${id} no encontrada`);
    }
    return multimedia;
  }

  // Actualiza el registro validando las referencias y el contenido resultantes.
  async update(
    id: number,
    dto: UpdateMultimediaDto,
    user: User,
  ): Promise<Multimedia> {
    const multimedia = await this.multimediaRepository.findOneBy({
      idMultimedia: id,
    });
    if (!multimedia) {
      throw new NotFoundException(`Multimedia con ID ${id} no encontrada`);
    }
    await this.validateEntidad(
      multimedia.tipoEntidad,
      multimedia.idEntidad,
      user,
    );

    const tipoEntidad = dto.tipoEntidad ?? multimedia.tipoEntidad;
    const idEntidad = dto.idEntidad ?? multimedia.idEntidad;
    const tipoContenido = dto.tipoContenido ?? multimedia.tipoContenido;
    const urlContenido =
      dto.urlContenido === undefined
        ? multimedia.urlContenido
        : dto.urlContenido;
    const textoContenido =
      dto.textoContenido === undefined
        ? multimedia.textoContenido
        : dto.textoContenido;

    await this.validateEntidad(tipoEntidad, idEntidad, user);
    if (
      tipoEntidad !== multimedia.tipoEntidad ||
      idEntidad !== multimedia.idEntidad
    ) {
      const cantidad = await this.multimediaRepository.countBy({
        tipoEntidad,
        idEntidad,
      });
      if (cantidad >= 10) {
        throw new BadRequestException(
          'No se pueden registrar más de 10 archivos multimedia por sitio o negocio',
        );
      }
    }
    this.validateContenido(tipoContenido, urlContenido, textoContenido);
    this.multimediaRepository.merge(multimedia, {
      ...dto,
      urlContenido:
        dto.urlContenido === undefined ? undefined : dto.urlContenido,
      textoContenido:
        dto.textoContenido === undefined ? undefined : dto.textoContenido,
    });
    return await this.multimediaRepository.save(multimedia);
  }

  // Elimina el registro multimedia indicado.
  async remove(id: number, user: User): Promise<void> {
    const multimedia = await this.multimediaRepository.findOneBy({
      idMultimedia: id,
    });
    if (!multimedia) {
      throw new NotFoundException(`Multimedia con ID ${id} no encontrada`);
    }
    await this.validateEntidad(
      multimedia.tipoEntidad,
      multimedia.idEntidad,
      user,
    );
    await this.multimediaRepository.remove(multimedia);
  }

  // Comprueba en la tabla correspondiente que la entidad polimórfica exista.
  private async validateEntidad(
    tipoEntidad: TipoEntidadMultimedia,
    idEntidad: number,
    user?: User,
  ): Promise<void> {
    if (tipoEntidad === TipoEntidadMultimedia.Sitio) {
      const exists = await this.sitioRepository.existsBy({ idSitio: idEntidad });
      if (!exists) {
        throw new NotFoundException(
          `Sitio turístico con ID ${idEntidad} no encontrado`,
        );
      }
      if (user && user.role !== UserRole.Admin) {
        throw new ForbiddenException(
          'Solo un administrador puede gestionar multimedia de sitios',
        );
      }
      return;
    }

    const negocio = await this.negocioRepository.findOneBy({
      idNegocio: idEntidad,
    });
    if (!negocio) {
      throw new NotFoundException(
        `Negocio con ID ${idEntidad} no encontrado`,
      );
    }
    if (
      user &&
      user.role !== UserRole.Admin &&
      negocio.idUsuario !== user.id
    ) {
      throw new ForbiddenException('No eres propietario de este negocio');
    }
  }

  // Exige texto o URL de acuerdo con el tipo de contenido seleccionado.
  private validateContenido(
    tipoContenido: TipoContenidoMultimedia,
    urlContenido: string | null | undefined,
    textoContenido: string | null | undefined,
  ): void {
    if (
      tipoContenido === TipoContenidoMultimedia.Texto &&
      !textoContenido?.trim()
    ) {
      throw new BadRequestException(
        'textoContenido es obligatorio cuando tipoContenido es texto',
      );
    }
    if (
      (tipoContenido === TipoContenidoMultimedia.Imagen ||
        tipoContenido === TipoContenidoMultimedia.Video) &&
      !urlContenido?.trim()
    ) {
      throw new BadRequestException(
        'urlContenido es obligatoria cuando tipoContenido es imagen o video',
      );
    }
  }
}
