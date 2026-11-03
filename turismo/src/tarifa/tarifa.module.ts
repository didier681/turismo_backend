import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Servicio } from '../servicio/entities/servicio.entity';
import { TarifaController } from './tarifa.controller';
import { TarifaService } from './tarifa.service';
import { Tarifa } from './entities/tarifa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tarifa, Servicio])],
  controllers: [TarifaController],
  providers: [TarifaService],
  exports: [TarifaService],
})
// Registra el CRUD de tarifas y el repositorio para validar el servicio.
export class TarifaModule {}
