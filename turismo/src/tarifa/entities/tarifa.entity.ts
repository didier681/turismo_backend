import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Servicio } from '../../servicio/entities/servicio.entity';

// Unidades permitidas para expresar el precio de una tarifa.
export enum UnidadTarifa {
  Persona = 'persona',
  Hora = 'hora',
  Paquete = 'paquete',
}

// Precio vigente para un servicio, expresado por una unidad definida.
@Entity('tarifas')
export class Tarifa {
  // Identificador único de la tarifa.
  @PrimaryGeneratedColumn({ name: 'id_tarifa' })
  idTarifa: number;

  // Clave foránea del servicio al que pertenece la tarifa.
  @Column({ type: 'int', name: 'id_servicio' })
  idServicio: number;

  // Servicio al que pertenece esta tarifa.
  @ManyToOne(() => Servicio, (servicio) => servicio.tarifas, {
    nullable: false,
  })
  @JoinColumn({ name: 'id_servicio', referencedColumnName: 'idServicio' })
  servicio: Servicio;

  // Nombre descriptivo de la tarifa.
  @Column({ type: 'varchar', length: 255, name: 'nombre_tarifa' })
  nombreTarifa: string;

  // Importe decimal de la tarifa, conservado como texto por TypeORM.
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: string;

  // Código de moneda de tres caracteres; por defecto se utiliza COP.
  @Column({ type: 'varchar', length: 3, default: 'COP' })
  moneda: string;

  // Unidad sobre la que se calcula el precio.
  @Column({ type: 'enum', enum: UnidadTarifa })
  unidad: UnidadTarifa;

  // Fecha desde la que comienza la vigencia de la tarifa.
  @Column({ type: 'date', name: 'vigencia_ini' })
  vigenciaIni: string;

  // Última fecha de vigencia de la tarifa, inclusive.
  @Column({ type: 'date', name: 'vigencia_fin' })
  vigenciaFin: string;
}
