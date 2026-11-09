import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { GestorZona } from '../gestor-zona/entities/gestor-zona.entity';
import { Zona } from '../zona/entities/zona.entity';

@Module({
  // Importar el repositorio de User
  imports: [TypeOrmModule.forFeature([User, GestorZona, Zona])],
  controllers: [UserController],
  providers: [UserService],
  // Exportar el servicio para usarlo en otros módulos (como Auth)
  exports: [UserService],
})
export class UserModule {}