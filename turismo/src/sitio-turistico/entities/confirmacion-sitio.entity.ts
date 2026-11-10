import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { SitioTuristico } from './sitio-turistico.entity';

// La clave compuesta impide que un usuario confirme dos veces el mismo sitio.
@Entity('confirmaciones_sitio')
export class ConfirmacionSitio {
  @PrimaryColumn({ type: 'int', name: 'id_usuario' })
  idUsuario: number;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id' })
  usuario: User;

  @PrimaryColumn({ type: 'int', name: 'id_sitio' })
  idSitio: number;

  @ManyToOne(() => SitioTuristico, (sitio) => sitio.confirmacionesUsuarios, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_sitio', referencedColumnName: 'idSitio' })
  sitio: SitioTuristico;
}
