import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SitioCategoria } from '../../sitio-categoria/entities/sitio-categoria.entity';
import { Zona } from '../../zona/entities/zona.entity';
import { Visita } from '../../visita/entities/visita.entity';
import { Favorito } from '../../favorito/entities/favorito.entity';
import { Resena } from '../../resena/entities/resena.entity';

export enum EstadoSitio {
  Activo = 'activo',
  Inactivo = 'inactivo',
}

// Lugar turístico georreferenciado que pertenece a una única zona.
@Entity('sitios_turisticos')
export class SitioTuristico {
  @PrimaryGeneratedColumn({ name: 'id_sitio' })
  idSitio: number;

  @Column({ type: 'int', name: 'id_zona' })
  idZona: number;

  // Relación obligatoria: cada sitio pertenece a una zona.
  @ManyToOne(() => Zona, (zona) => zona.sitios, { nullable: false })
  @JoinColumn({ name: 'id_zona', referencedColumnName: 'idZona' })
  zona: Zona;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitud: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitud: string;

  @Column({ type: 'time', name: 'horario_apertura' })
  horarioApertura: string;

  @Column({ type: 'time', name: 'horario_cierre' })
  horarioCierre: string;

  @Column({
    type: 'enum',
    enum: EstadoSitio,
    default: EstadoSitio.Activo,
  })
  estado: EstadoSitio;

  // Categorías asociadas mediante la entidad puente N:M.
  @OneToMany(() => SitioCategoria, (sitioCategoria) => sitioCategoria.sitio)
  categorias: SitioCategoria[];

  // Interacciones registradas por los visitantes de este sitio.
  @OneToMany(() => Visita, (visita) => visita.sitio)
  visitas: Visita[];

  @OneToMany(() => Favorito, (favorito) => favorito.sitio)
  favoritos: Favorito[];

  @OneToMany(() => Resena, (resena) => resena.sitio)
  resenas: Resena[];
}
