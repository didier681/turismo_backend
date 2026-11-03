import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { NegocioCategoria } from '../../negocio-categoria/entities/negocio-categoria.entity';

// Clasificación reutilizable para organizar los negocios.
@Entity('categorias_negocio')
export class CategoriaNegocio {
  @PrimaryGeneratedColumn({ name: 'id_categoria_neg' })
  idCategoriaNeg: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  // Negocios asociados a esta categoría mediante la tabla puente.
  @OneToMany(
    () => NegocioCategoria,
    (negocioCategoria) => negocioCategoria.categoria,
  )
  negocios: NegocioCategoria[];
}
