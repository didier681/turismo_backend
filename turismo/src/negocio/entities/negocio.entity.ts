import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SitioTuristico } from '../../sitio-turistico/entities/sitio-turistico.entity';
import { NegocioCategoria } from '../../negocio-categoria/entities/negocio-categoria.entity';
import { Servicio } from '../../servicio/entities/servicio.entity';

export enum EstadoMembresia {
  Gratis = 'gratis',
  Basico = 'basico',
  Premium = 'premium',
}

// Negocio ubicado en un sitio turístico, con categorías y servicios propios.
@Entity('negocios')
export class Negocio {
  @PrimaryGeneratedColumn({ name: 'id_negocio' })
  idNegocio: number;

  @Column({ type: 'int', name: 'id_sitio' })
  idSitio: number;

  // Sitio turístico al que pertenece obligatoriamente el negocio.
  @ManyToOne(() => SitioTuristico, { nullable: false })
  @JoinColumn({ name: 'id_sitio', referencedColumnName: 'idSitio' })
  sitio: SitioTuristico;

  @Column({ type: 'varchar', length: 255, name: 'nombre_comercial' })
  nombreComercial: string;

  @Column({ type: 'varchar', length: 50, name: 'nit_documento' })
  nitDocumento: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitud: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitud: string;

  @Column({ type: 'varchar', length: 30 })
  telefono: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({
    type: 'enum',
    enum: EstadoMembresia,
    name: 'estado_membresia',
    default: EstadoMembresia.Gratis,
  })
  estadoMembresia: EstadoMembresia;

  // Clasificaciones asociadas mediante la tabla puente N:M.
  @OneToMany(
    () => NegocioCategoria,
    (negocioCategoria) => negocioCategoria.negocio,
  )
  categorias: NegocioCategoria[];

  // Servicios ofrecidos por este negocio.
  @OneToMany(() => Servicio, (servicio) => servicio.negocio)
  servicios: Servicio[];
}
