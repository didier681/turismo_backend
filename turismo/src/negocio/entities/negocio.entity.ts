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
import { Zona } from '../../zona/entities/zona.entity';
import { User } from '../../user/entities/user.entity';

// Niveles de membresía permitidos para un negocio.
export enum EstadoMembresia {
  Gratis = 'gratis',
  Basico = 'basico',
  Premium = 'premium',
}

// Negocio que siempre pertenece a una zona, asociado opcionalmente a un sitio turístico.
@Entity('negocios')
export class Negocio {
  // Identificador único del negocio.
  @PrimaryGeneratedColumn({ name: 'id_negocio' })
  idNegocio: number;

  // Usuario propietario del negocio.
  @Column({ type: 'int', name: 'id_usuario' })
  idUsuario: number;

  @ManyToOne(() => User, (usuario) => usuario.negocios, { nullable: false })
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id' })
  usuario: User;

  // Clave foránea obligatoria de la zona a la que pertenece el negocio.
  @Column({ type: 'int', name: 'id_zona' })
  idZona: number;

  // Un negocio siempre pertenece a una zona, aunque no esté asociado a un sitio.
  @ManyToOne(() => Zona, { nullable: false })
  @JoinColumn({ name: 'id_zona', referencedColumnName: 'idZona' })
  zona: Zona;

  // Clave opcional del sitio turístico asociado al negocio.
  @Column({ type: 'int', name: 'id_sitio', nullable: true })
  idSitio: number | null;

  // Un negocio puede estar o no asociado a un sitio turístico.
  @ManyToOne(() => SitioTuristico, { nullable: true })
  @JoinColumn({ name: 'id_sitio', referencedColumnName: 'idSitio' })
  sitio: SitioTuristico | null;

  // Nombre comercial con el que se identifica el negocio.
  @Column({ type: 'varchar', length: 255, name: 'nombre_comercial' })
  nombreComercial: string;

  // NIT u otro documento de identificación del negocio.
  @Column({ type: 'varchar', length: 50, name: 'nit_documento' })
  nitDocumento: string;

  // Latitud geográfica del negocio en formato decimal.
  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitud: string;

  // Longitud geográfica del negocio en formato decimal.
  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitud: string;

  // Teléfono de contacto del negocio.
  @Column({ type: 'varchar', length: 30 })
  telefono: string;

  // Correo electrónico de contacto del negocio.
  @Column({ type: 'varchar', length: 255 })
  email: string;

  // Nivel de membresía; si no se indica, inicia como gratis.
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
