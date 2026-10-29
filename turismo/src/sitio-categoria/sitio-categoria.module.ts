import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaSitio } from '../categoria-sitio/entities/categoria-sitio.entity';
import { SitioCategoria } from './entities/sitio-categoria.entity';
import { SitioTuristico } from '../sitio-turistico/entities/sitio-turistico.entity';
import { SitioCategoriaController } from './sitio-categoria.controller';
import { SitioCategoriaService } from './sitio-categoria.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SitioCategoria,
      SitioTuristico,
      CategoriaSitio,
    ]),
  ],
  controllers: [SitioCategoriaController],
  providers: [SitioCategoriaService],
  exports: [SitioCategoriaService],
})
// Registra la administración de la asociación sitio-categoría.
export class SitioCategoriaModule {}
