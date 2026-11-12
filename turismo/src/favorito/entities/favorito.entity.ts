import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Transform } from 'class-transformer';
import { User } from '../../user/entities/user.entity';
import { SitioTuristico } from '../../sitio-turistico/entities/sitio-turistico.entity';

// Asociación usuario-sitio; ambos IDs forman una clave primaria compuesta.
@Entity('favoritos')
export class Favorito {
  @PrimaryColumn({ type: 'int', name: 'id_usuario' })
  idUsuario: number;

  // Usuario propietario del favorito; se reutiliza la entidad existente.
  // Un favorito solo expone id y nombre para no filtrar datos personales.
  @Transform(
    ({ value }: { value: User | null }) =>
      value ? { id: value.id, nombre: value.nombre } : value,
    { toPlainOnly: true },
  )
  @ManyToOne(() => User, (usuario) => usuario.favoritos, { nullable: false })
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id' })
  usuario: User;

  @PrimaryColumn({ type: 'int', name: 'id_sitio' })
  idSitio: number;

  // Sitio guardado por el usuario.
  @ManyToOne(() => SitioTuristico, (sitio) => sitio.favoritos, {
    nullable: false,
  })
  @JoinColumn({ name: 'id_sitio', referencedColumnName: 'idSitio' })
  sitio: SitioTuristico;

  // Fecha de registro del favorito, generada automáticamente.
  @CreateDateColumn({ name: 'fecha', type: 'timestamp' })
  fecha: Date;
}
