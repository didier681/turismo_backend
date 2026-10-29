import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SitioTuristico } from '../sitio-turistico/entities/sitio-turistico.entity';
import { User } from '../user/entities/user.entity';
import { Zona } from '../zona/entities/zona.entity';
import { VisitaController } from './visita.controller';
import { Visita } from './entities/visita.entity';
import { VisitaService } from './visita.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Visita, User, Zona, SitioTuristico]),
  ],
  controllers: [VisitaController],
  providers: [VisitaService],
  exports: [VisitaService],
})
// Registra las dependencias necesarias para gestionar visitas.
export class VisitaModule {}
