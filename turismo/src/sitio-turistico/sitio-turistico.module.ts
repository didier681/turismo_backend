import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SitioTuristico } from './entities/sitio-turistico.entity';
import { Zona } from '../zona/entities/zona.entity';
import { SitioTuristicoController } from './sitio-turistico.controller';
import { SitioTuristicoService } from './sitio-turistico.service';

@Module({
  imports: [TypeOrmModule.forFeature([SitioTuristico, Zona])],
  controllers: [SitioTuristicoController],
  providers: [SitioTuristicoService],
  exports: [SitioTuristicoService],
})
// Registra el CRUD de sitios y los repositorios necesarios para validar su zona.
export class SitioTuristicoModule {}
