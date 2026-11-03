import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SitioTuristico } from '../sitio-turistico/entities/sitio-turistico.entity';
import { NegocioController } from './negocio.controller';
import { NegocioService } from './negocio.service';
import { Negocio } from './entities/negocio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Negocio, SitioTuristico])],
  controllers: [NegocioController],
  providers: [NegocioService],
  exports: [NegocioService],
})
// Registra el CRUD de negocios y los repositorios para validar su sitio.
export class NegocioModule {}
