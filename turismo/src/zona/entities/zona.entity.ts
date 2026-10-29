import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SitioTuristico } from '../../sitio-turistico/entities/sitio-turistico.entity';
import { Visita } from '../../visita/entities/visita.entity';

export enum TipoZona {
  Pais = 'pais',
  Departamento = 'depto',
  Ciudad = 'ciudad',
  Barrio = 'barrio',
}

// Zona geográfica que agrupa sitios; el modelo no establece zonas padre.
@Entity('zonas')
export class Zona {
  @PrimaryGeneratedColumn({ name: 'id_zona' })
  idZona: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'enum', enum: TipoZona })
  tipo: TipoZona;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitud: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitud: string;

  @Column({ type: 'int', name: 'radio_cobertura_m' })
  radioCoberturaM: number;

  // Sitios turísticos que se encuentran dentro de esta zona.
  @OneToMany(() => SitioTuristico, (sitio) => sitio.zona)
  sitios: SitioTuristico[];

  // Visitas que registran esta zona como contexto geográfico.
  @OneToMany(() => Visita, (visita) => visita.zona)
  visitas: Visita[];
}
