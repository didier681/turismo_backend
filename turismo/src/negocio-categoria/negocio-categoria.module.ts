import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaNegocio } from '../categoria-negocio/entities/categoria-negocio.entity';
import { Negocio } from '../negocio/entities/negocio.entity';
import { NegocioCategoriaController } from './negocio-categoria.controller';
import { NegocioCategoriaService } from './negocio-categoria.service';
import { NegocioCategoria } from './entities/negocio-categoria.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NegocioCategoria, Negocio, CategoriaNegocio]),
  ],
  controllers: [NegocioCategoriaController],
  providers: [NegocioCategoriaService],
  exports: [NegocioCategoriaService],
})
// Registra la administración de la asociación negocio-categoría.
export class NegocioCategoriaModule {}
