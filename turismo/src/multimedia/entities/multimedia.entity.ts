import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// Tipos de entidad que pueden tener contenido multimedia.
export enum TipoEntidadMultimedia {
  Sitio = 'sitio',
  Negocio = 'negocio',
}

// Formatos de contenido admitidos por el catálogo.
export enum TipoContenidoMultimedia {
  Texto = 'texto',
  Imagen = 'imagen',
  Video = 'video',
}

// Contenido asociado de forma polimórfica a un sitio o a un negocio.
@Entity('multimedia')
export class Multimedia {
  // Identificador único del registro multimedia.
  @PrimaryGeneratedColumn({ name: 'id_multimedia' })
  idMultimedia: number;

  // Indica el tipo de entidad a la que pertenece el contenido.
  @Column({ type: 'enum', enum: TipoEntidadMultimedia, name: 'tipo_entidad' })
  tipoEntidad: TipoEntidadMultimedia;

  // Identificador del sitio o negocio indicado por tipoEntidad.
  @Column({ type: 'int', name: 'id_entidad' })
  idEntidad: number;

  // Formato del contenido multimedia almacenado.
  @Column({
    type: 'enum',
    enum: TipoContenidoMultimedia,
    name: 'tipo_contenido',
  })
  tipoContenido: TipoContenidoMultimedia;

  // Dirección del recurso visual o audiovisual, si aplica.
  @Column({ type: 'varchar', length: 2048, name: 'url_contenido', nullable: true })
  urlContenido: string | null;

  // Texto asociado al registro cuando el contenido es de tipo texto.
  @Column({ type: 'text', name: 'texto_contenido', nullable: true })
  textoContenido: string | null;

  // Posición en la que se presenta este contenido frente a los demás.
  @Column({ type: 'int' })
  orden: number;
}
