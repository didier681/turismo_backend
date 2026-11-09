import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Zona } from '../../zona/entities/zona.entity';

// Relaciona gestores y zonas; la clave compuesta evita asignaciones duplicadas.
@Entity('gestor_zona')
export class GestorZona {
  @PrimaryColumn({ type: 'int', name: 'id_usuario' })
  idUsuario: number;

  @ManyToOne(() => User, (usuario) => usuario.zonasAsignadas, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id' })
  usuario: User;

  @PrimaryColumn({ type: 'int', name: 'id_zona' })
  idZona: number;

  @ManyToOne(() => Zona, (zona) => zona.gestoresAsignados, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_zona', referencedColumnName: 'idZona' })
  zona: Zona;
}
