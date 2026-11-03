import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Negocio } from '../negocio/entities/negocio.entity';
import { ServicioController } from './servicio.controller';
import { ServicioService } from './servicio.service';
import { Servicio } from './entities/servicio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Servicio, Negocio])],
  controllers: [ServicioController],
  providers: [ServicioService],
  exports: [ServicioService],
})
// Registra el CRUD de servicios y el repositorio para validar el negocio.
export class ServicioModule {}
