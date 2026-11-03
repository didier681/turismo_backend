import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Negocio } from '../../negocio/entities/negocio.entity';
import { Tarifa } from '../../tarifa/entities/tarifa.entity';

// Servicio ofrecido por un negocio, con tarifas asociadas.
@Entity('servicios')
export class Servicio {
  @PrimaryGeneratedColumn({ name: 'id_servicio' })
  idServicio: number;

  @Column({ type: 'int', name: 'id_negocio' })
  idNegocio: number;

  // Negocio responsable de ofrecer el servicio.
  @ManyToOne(() => Negocio, (negocio) => negocio.servicios, {
    nullable: false,
  })
  @JoinColumn({ name: 'id_negocio', referencedColumnName: 'idNegocio' })
  negocio: Negocio;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'varchar', length: 255 })
  disponibilidad: string;

  // Tarifas configuradas para este servicio.
  @OneToMany(() => Tarifa, (tarifa) => tarifa.servicio)
  tarifas: Tarifa[];
}
