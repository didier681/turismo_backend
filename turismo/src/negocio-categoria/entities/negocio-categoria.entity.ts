import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CategoriaNegocio } from '../../categoria-negocio/entities/categoria-negocio.entity';
import { Negocio } from '../../negocio/entities/negocio.entity';

// Tabla puente N:M; la clave compuesta impide repetir la misma categoría.
@Entity('negocio_categoria')
export class NegocioCategoria {
  @PrimaryColumn({ type: 'int', name: 'id_negocio' })
  idNegocio: number;

  // Al borrar un negocio también se eliminan sus asociaciones de categoría.
  @ManyToOne(() => Negocio, (negocio) => negocio.categorias, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_negocio', referencedColumnName: 'idNegocio' })
  negocio: Negocio;

  @PrimaryColumn({ type: 'int', name: 'id_categoria_neg' })
  idCategoriaNeg: number;

  // Al borrar una categoría se eliminan sus asociaciones con negocios.
  @ManyToOne(() => CategoriaNegocio, (categoria) => categoria.negocios, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'id_categoria_neg',
    referencedColumnName: 'idCategoriaNeg',
  })
  categoria: CategoriaNegocio;
}
