import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SitioTuristico } from '../sitio-turistico/entities/sitio-turistico.entity';
import { User } from '../user/entities/user.entity';
import { FavoritoController } from './favorito.controller';
import { Favorito } from './entities/favorito.entity';
import { FavoritoService } from './favorito.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorito, User, SitioTuristico]),
  ],
  controllers: [FavoritoController],
  providers: [FavoritoService],
  exports: [FavoritoService],
})
// Registra el CRUD de favoritos y sus entidades relacionadas.
export class FavoritoModule {}
