import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Negocio } from '../negocio/entities/negocio.entity';
import { SitioTuristico } from '../sitio-turistico/entities/sitio-turistico.entity';
import { PublicidadController } from './publicidad.controller';
import { PublicidadService } from './publicidad.service';
import { Publicidad } from './entities/publicidad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Publicidad, Negocio, SitioTuristico])],
  controllers: [PublicidadController],
  providers: [PublicidadService],
  exports: [PublicidadService],
})
// Registra el CRUD de publicidades y las referencias que deben validarse.
export class PublicidadModule {}
