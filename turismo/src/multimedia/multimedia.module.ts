import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Negocio } from '../negocio/entities/negocio.entity';
import { SitioTuristico } from '../sitio-turistico/entities/sitio-turistico.entity';
import { MultimediaController } from './multimedia.controller';
import { MultimediaService } from './multimedia.service';
import { Multimedia } from './entities/multimedia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Multimedia, SitioTuristico, Negocio])],
  controllers: [MultimediaController],
  providers: [MultimediaService],
  exports: [MultimediaService],
})
// Registra el CRUD multimedia y los repositorios para validar su entidad.
export class MultimediaModule {}
