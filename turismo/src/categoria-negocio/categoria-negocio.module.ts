import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaNegocioController } from './categoria-negocio.controller';
import { CategoriaNegocioService } from './categoria-negocio.service';
import { CategoriaNegocio } from './entities/categoria-negocio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaNegocio])],
  controllers: [CategoriaNegocioController],
  providers: [CategoriaNegocioService],
  exports: [CategoriaNegocioService],
})
// Registra el controlador y el repositorio de categorías de negocio.
export class CategoriaNegocioModule {}
