import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { SitioTuristico } from '../../sitio-turistico/entities/sitio-turistico.entity';
import { Zona } from '../../zona/entities/zona.entity';

// Registro de llegada de un usuario a un sitio y zona determinados.
@Entity('visitas')
export class Visita {
  @PrimaryGeneratedColumn({ name: 'id_visita' })
  idVisita: number;

  @Column({ type: 'int', name: 'id_usuario' })
  idUsuario: number;

  // Usuario que realizó la visita; se reutiliza la entidad de autenticación.
  @ManyToOne(() => User, (usuario) => usuario.visitas, { nullable: false })
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id' })
  usuario: User;

  @Column({ type: 'int', name: 'id_zona' })
  idZona: number;

  // Zona registrada; el servicio verifica que corresponda al sitio indicado.
  @ManyToOne(() => Zona, (zona) => zona.visitas, { nullable: false })
  @JoinColumn({ name: 'id_zona', referencedColumnName: 'idZona' })
  zona: Zona;

  @Column({ type: 'int', name: 'id_sitio' })
  idSitio: number;

  // Sitio concreto visitado, necesario para identificar el destino.
  @ManyToOne(() => SitioTuristico, (sitio) => sitio.visitas, {
    nullable: false,
  })
  @JoinColumn({ name: 'id_sitio', referencedColumnName: 'idSitio' })
  sitio: SitioTuristico;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitud: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitud: string;

  // Momento de creación asignado automáticamente por TypeORM.
  @CreateDateColumn({ name: 'fecha_hora', type: 'timestamp' })
  fechaHora: Date;
}
