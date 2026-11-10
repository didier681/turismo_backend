import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Visita } from '../../visita/entities/visita.entity';
import { Favorito } from '../../favorito/entities/favorito.entity';
import { Resena } from '../../resena/entities/resena.entity';
import { Negocio } from '../../negocio/entities/negocio.entity';
import { GestorZona } from '../../gestor-zona/entities/gestor-zona.entity';
import { SitioTuristico } from '../../sitio-turistico/entities/sitio-turistico.entity';

// Roles disponibles para controlar el acceso a las funciones de la plataforma.
export enum UserRole {
  Admin = 'admin',
  Usuario = 'usuario',
  Negocio = 'negocio',
  Gestor = 'gestor',
}

// Representa al usuario y conserva los datos requeridos por autenticación y turismo.
@Entity('users')
export class User {
  // Identificador único expuesto como id_usuario en la base de datos.
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  id: number;

  // Correo único utilizado para identificar la cuenta durante el inicio de sesión.
  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  // Documento único opcional para turistas y obligatorio para gestores.
  @Column({
    type: 'varchar',
    length: 20,
    name: 'documento_identidad',
    unique: true,
    nullable: true,
  })
  documentoIdentidad: string | null;

  // URL opcional del soporte entregado por un gestor.
  @Column({
    type: 'varchar',
    length: 255,
    name: 'soporte_url',
    nullable: true,
  })
  soporteUrl: string | null;

  // Hash de la contraseña; se carga para autenticar y se excluye de las respuestas.
  @Exclude()
  @Column({
    type: 'varchar',
    length: 255,
    name: 'password_hash',
    nullable: false,
    select: false,
  })
  passwordHash: string;

  // Nombre visible del usuario, almacenado según el modelo turístico.
  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  // Idioma preferido para la aplicación; por defecto se utiliza español.
  @Column({ type: 'varchar', length: 10, name: 'idioma_pref', default: 'es' })
  idiomaPref: string;

  // Fecha y hora de registro generadas automáticamente al crear la cuenta.
  @CreateDateColumn({ type: 'timestamp', name: 'fecha_registro' })
  fechaRegistro: Date;

  // Permite a autenticación y autorización bloquear cuentas desactivadas.
  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  // Rol utilizado por los guards para autorizar las operaciones del usuario.
  @Column({
    type: 'enum',
    enum: UserRole,
    name: 'rol',
    default: UserRole.Usuario,
  })
  role: UserRole;

  // Visitas registradas por este usuario.
  @OneToMany(() => Visita, (visita) => visita.usuario)
  visitas: Visita[];

  // Sitios turísticos que este usuario ha guardado como favoritos.
  @OneToMany(() => Favorito, (favorito) => favorito.usuario)
  favoritos: Favorito[];

  // Reseñas de sitios turísticos escritas por este usuario.
  @OneToMany(() => Resena, (resena) => resena.usuario)
  resenas: Resena[];

  // Negocios registrados por este usuario.
  @OneToMany(() => Negocio, (negocio) => negocio.usuario)
  negocios: Negocio[];

  // Zonas asignadas a este gestor.
  @OneToMany(() => GestorZona, (gestorZona) => gestorZona.usuario)
  zonasAsignadas: GestorZona[];

  // Sugerencias de sitios enviadas por este usuario.
  @OneToMany(() => SitioTuristico, (sitio) => sitio.usuarioSugiere)
  sitiosSugeridos: SitioTuristico[];
}
