import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Negocio } from '../../negocio/entities/negocio.entity';
import { SitioTuristico } from '../../sitio-turistico/entities/sitio-turistico.entity';

// Planes de promoción disponibles para una publicidad.
export enum TipoPlanPublicidad {
  Basico = 'basico',
  Premium = 'premium',
  Destacado = 'destacado',
}

// Estados que indican si una publicidad se está mostrando o no.
export enum EstadoPublicidad {
  Activo = 'activo',
  Pausado = 'pausado',
  Vencido = 'vencido',
}

// Campaña promocional de un negocio, opcionalmente vinculada a un sitio.
@Entity('publicidades')
export class Publicidad {
  // Identificador único de la publicidad.
  @PrimaryGeneratedColumn({ name: 'id_publicidad' })
  idPublicidad: number;

  // Clave del negocio responsable de la campaña.
  @Column({ type: 'int', name: 'id_negocio' })
  idNegocio: number;

  // Negocio al que pertenece obligatoriamente la publicidad.
  @ManyToOne(() => Negocio, { nullable: false })
  @JoinColumn({ name: 'id_negocio', referencedColumnName: 'idNegocio' })
  negocio: Negocio;

  // Clave opcional del sitio turístico asociado a la campaña.
  @Column({ type: 'int', name: 'id_sitio_asociado', nullable: true })
  idSitioAsociado: number | null;

  // Sitio turístico que la publicidad puede destacar.
  @ManyToOne(() => SitioTuristico, { nullable: true })
  @JoinColumn({
    name: 'id_sitio_asociado',
    referencedColumnName: 'idSitio',
  })
  sitioAsociado: SitioTuristico | null;

  // Plan contratado para la difusión de la publicidad.
  @Column({ type: 'enum', enum: TipoPlanPublicidad, name: 'tipo_plan' })
  tipoPlan: TipoPlanPublicidad;

  // Presupuesto de la campaña, conservado como texto por TypeORM.
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  presupuesto: string;

  // Fecha desde la que comienza la campaña.
  @Column({ type: 'date', name: 'fecha_ini' })
  fechaIni: string;

  // Fecha final de la campaña, posterior a la fecha inicial.
  @Column({ type: 'date', name: 'fecha_fin' })
  fechaFin: string;

  // Estado actual de la publicidad; por defecto queda activa.
  @Column({
    type: 'enum',
    enum: EstadoPublicidad,
    default: EstadoPublicidad.Activo,
  })
  estado: EstadoPublicidad;
}
