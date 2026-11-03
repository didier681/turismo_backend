import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Servicio } from '../../servicio/entities/servicio.entity';

export enum UnidadTarifa {
  Persona = 'persona',
  Hora = 'hora',
  Paquete = 'paquete',
}

// Precio vigente para un servicio, expresado por una unidad definida.
@Entity('tarifas')
export class Tarifa {
  @PrimaryGeneratedColumn({ name: 'id_tarifa' })
  idTarifa: number;

  @Column({ type: 'int', name: 'id_servicio' })
  idServicio: number;

  // Servicio al que pertenece esta tarifa.
  @ManyToOne(() => Servicio, (servicio) => servicio.tarifas, {
    nullable: false,
  })
  @JoinColumn({ name: 'id_servicio', referencedColumnName: 'idServicio' })
  servicio: Servicio;

  @Column({ type: 'varchar', length: 255, name: 'nombre_tarifa' })
  nombreTarifa: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: string;

  @Column({ type: 'varchar', length: 3, default: 'COP' })
  moneda: string;

  @Column({ type: 'enum', enum: UnidadTarifa })
  unidad: UnidadTarifa;

  @Column({ type: 'date', name: 'vigencia_ini' })
  vigenciaIni: string;

  @Column({ type: 'date', name: 'vigencia_fin' })
  vigenciaFin: string;
}
