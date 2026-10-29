import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SitioCategoria } from '../../sitio-categoria/entities/sitio-categoria.entity';

// Clasificación reutilizable para describir sitios turísticos.
@Entity('categorias_sitio')
export class CategoriaSitio {
  @PrimaryGeneratedColumn({ name: 'id_categoria' })
  idCategoria: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'varchar', length: 255 })
  icono: string;

  // Sitios vinculados a esta categoría a través de la tabla puente.
  @OneToMany(
    () => SitioCategoria,
    (sitioCategoria) => sitioCategoria.categoria,
  )
  sitios: SitioCategoria[];
}
