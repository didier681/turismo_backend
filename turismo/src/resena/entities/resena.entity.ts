import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { SitioTuristico } from '../../sitio-turistico/entities/sitio-turistico.entity';

// Opinión de un usuario sobre un sitio turístico.
@Entity('resenas')
export class Resena {
  @PrimaryGeneratedColumn({ name: 'id_resena' })
  idResena: number;

  @Column({ type: 'int', name: 'id_usuario' })
  idUsuario: number;

  // Autor de la reseña, asociado a la entidad User de la aplicación.
  @ManyToOne(() => User, (usuario) => usuario.resenas, { nullable: false })
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id' })
  usuario: User;

  @Column({ type: 'int', name: 'id_sitio' })
  idSitio: number;

  // Sitio al que corresponden la calificación y el comentario.
  @ManyToOne(() => SitioTuristico, (sitio) => sitio.resenas, {
    nullable: false,
  })
  @JoinColumn({ name: 'id_sitio', referencedColumnName: 'idSitio' })
  sitio: SitioTuristico;

  @Column({ type: 'int' })
  calificacion: number;

  @Column({ type: 'text' })
  comentario: string;
}
