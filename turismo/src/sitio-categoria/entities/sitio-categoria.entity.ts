import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { CategoriaSitio } from '../../categoria-sitio/entities/categoria-sitio.entity';
import { SitioTuristico } from '../../sitio-turistico/entities/sitio-turistico.entity';

// Tabla puente N:M; la clave compuesta impide duplicar una categoría por sitio.
@Entity('sitio_categoria')
export class SitioCategoria {
  @PrimaryColumn({ type: 'int', name: 'id_sitio' })
  idSitio: number;

  // Eliminar un sitio elimina también sus asociaciones de categoría.
  @ManyToOne(() => SitioTuristico, (sitio) => sitio.categorias, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_sitio', referencedColumnName: 'idSitio' })
  sitio: SitioTuristico;

  @PrimaryColumn({ type: 'int', name: 'id_categoria' })
  idCategoria: number;

  // Eliminar una categoría elimina sus asociaciones con sitios.
  @ManyToOne(() => CategoriaSitio, (categoria) => categoria.sitios, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_categoria', referencedColumnName: 'idCategoria' })
  categoria: CategoriaSitio;
}
