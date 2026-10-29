import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SitioTuristico } from '../sitio-turistico/entities/sitio-turistico.entity';
import { Zona } from './entities/zona.entity';
import { ZonaController } from './zona.controller';
import { ZonaService } from './zona.service';

@Module({
  imports: [TypeOrmModule.forFeature([Zona, SitioTuristico])],
  controllers: [ZonaController],
  providers: [ZonaService],
  exports: [ZonaService],
})
// Registra el controlador, el servicio y repositorios del módulo de zonas.
export class ZonaModule {}
