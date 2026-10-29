import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaSitio } from './entities/categoria-sitio.entity';
import { CategoriaSitioController } from './categoria-sitio.controller';
import { CategoriaSitioService } from './categoria-sitio.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaSitio])],
  controllers: [CategoriaSitioController],
  providers: [CategoriaSitioService],
  exports: [CategoriaSitioService],
})
// Agrupa el controlador, servicio y repositorio de categorías de sitio.
export class CategoriaSitioModule {}
