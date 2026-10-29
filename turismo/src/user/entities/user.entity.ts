import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Visita } from '../../visita/entities/visita.entity';
import { Favorito } from '../../favorito/entities/favorito.entity';
import { Resena } from '../../resena/entities/resena.entity';

// Decorador @Entity define que esta clase es una entidad de base de datos
@Entity('users')
export class User {
  // Clave primaria auto-incremental
  @PrimaryGeneratedColumn()
  id: number;

  // Columna de email única y no nula
  @Column({ unique: true, nullable: false })
  email: string;

  // Columna de contraseña (se guardará encriptada)
  // select: false evita que se lea por defecto en las consultas
  // @Exclude() evita que se envíe en las respuestas HTTP (ver sección 5)
  @Exclude()
  @Column({ nullable: false, select: false })
  password: string;

  // Nombre completo del usuario
  @Column({ nullable: false })
  fullName: string;

  // Estado activo del usuario
  @Column({ default: true })
  isActive: boolean;

  // Rol del usuario (por defecto 'user')
  @Column({ default: 'user' })
  role: string;

  // Fecha de creación automática
  @CreateDateColumn()
  createdAt: Date;

  // Fecha de actualización automática
  @UpdateDateColumn()
  updatedAt: Date;

  // Historial de visitas registradas por esta cuenta.
  @OneToMany(() => Visita, (visita) => visita.usuario)
  visitas: Visita[];

  // Sitios que el usuario ha guardado como favoritos.
  @OneToMany(() => Favorito, (favorito) => favorito.usuario)
  favoritos: Favorito[];

  // Opiniones que el usuario ha publicado sobre sitios turísticos.
  @OneToMany(() => Resena, (resena) => resena.usuario)
  resenas: Resena[];
}